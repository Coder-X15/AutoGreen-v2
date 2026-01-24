from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
import sqlite3
from datetime import datetime
from google import genai
from contextlib import closing
from google.genai import types

# Load environment variables
load_dotenv()

# --- Project Path Setup ---
# Resolve path relative to this file: backend/app/main.py -> backend/ -> project_root/
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))

# Gemini Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai_client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

# Database connection setup
DB_PATH = os.path.join(project_root, "agro.db")

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=30.0)
conn.row_factory = dict_factory

def init_db():
    with closing(conn.cursor()) as cur:
        # Create tables
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                email TEXT,
                organization TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS plants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                species TEXT,
                health_status TEXT,
                image_url TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS trends (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                description TEXT,
                source_url TEXT,
                image_url TEXT
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                is_completed BOOLEAN,
                due_date TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT,
                role TEXT,
                timestamp TIMESTAMP
            )
        """)

        # Seed default user if not exists
        cur.execute("SELECT count(*) as count FROM users")
        if cur.fetchone()['count'] == 0:
            cur.execute(
                "INSERT INTO users (username, password, email, organization) VALUES (?, ?, ?, ?)",
                ("user", "password", "user@example.com", "Home Garden")
            )
        conn.commit()

# Initialize database on startup
init_db()

# FastAPI app setup
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
static_dir = os.path.join(project_root, "frontend", "client", "public")

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
else:
    print(f"Warning: Static directory not found at {static_dir}. Static files will not be served.")

# Models
class User(BaseModel):
    id: Optional[int]
    username: str
    password: str
    email: str
    organization: str

class LoginRequest(BaseModel):
    username: str
    password: str

class TaskToggle(BaseModel):
    isCompleted: bool

class ChatRequest(BaseModel):
    content: str

# Routes
@app.post("/api/auth/login")
async def login(user: LoginRequest):
    try:
        print(f"Login attempt for user: {user.username}")
        with closing(conn.cursor()) as cur:
            cur.execute("SELECT * FROM users WHERE username = ?", (user.username,))
            result = cur.fetchone()
            if result:
                if result["password"] != user.password: # type: ignore
                    raise HTTPException(status_code=401, detail="Invalid credentials")
            else:
                cur.execute(
                    "INSERT INTO users (username, password, email, organization) VALUES (?, ?, ?, ?)",
                    (user.username, user.password, f"{user.username}@example.com", "Home Garden"),
                )
                conn.commit()
                cur.execute("SELECT * FROM users WHERE username = ?", (user.username,))
                result = cur.fetchone()
            
            if not result:
                raise HTTPException(status_code=500, detail="Failed to create or retrieve user")
            return JSONResponse(content=jsonable_encoder(result))
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/user/{user_id}")
async def get_user(user_id: int):
    with closing(conn.cursor()) as cur:
        cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return JSONResponse(content=jsonable_encoder(result))

@app.put("/api/auth/user/{user_id}")
async def update_user(user_id: int, user: User):
    with closing(conn.cursor()) as cur:
        cur.execute(
            "UPDATE users SET username = ?, password = ?, email = ?, organization = ? WHERE id = ?",
            (user.username, user.password, user.email, user.organization, user_id),
        )
        conn.commit()
        cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return JSONResponse(content=jsonable_encoder(result))

@app.get("/static/{file_path:path}")
async def serve_static(file_path: str):
    file_location = os.path.join(static_dir, file_path)
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_location)

# Plants
@app.get("/api/plants")
async def get_plants():
    with closing(conn.cursor()) as cur:
        cur.execute('SELECT id, name, species, health_status as "healthStatus", image_url as "imageUrl" FROM plants')
        plants = cur.fetchall()
    return JSONResponse(content=jsonable_encoder(plants))

@app.get("/api/plants/{plant_id}")
async def get_plant(plant_id: int):
    with closing(conn.cursor()) as cur:
        cur.execute('SELECT id, name, species, health_status as "healthStatus", image_url as "imageUrl" FROM plants WHERE id = ?', (plant_id,))
        plant = cur.fetchone()
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")
    return JSONResponse(content=jsonable_encoder(plant))

# Trends
@app.get("/api/trends")
async def get_trends(search: Optional[str] = None):
    with closing(conn.cursor()) as cur:
        if search:
            query = 'SELECT id, title, description, source_url as "sourceUrl", image_url as "imageUrl" FROM trends WHERE title LIKE ? OR description LIKE ?'
            # Use '%' for wildcard matching in SQL
            like_pattern = f"%{search}%"
            cur.execute(query, (like_pattern, like_pattern))
        else:
            cur.execute('SELECT id, title, description, source_url as "sourceUrl", image_url as "imageUrl" FROM trends')
        trends = cur.fetchall()
    return JSONResponse(content=jsonable_encoder(trends))

# Tasks
@app.get("/api/tasks")
async def get_tasks():
    with closing(conn.cursor()) as cur:
        cur.execute('SELECT id, title, is_completed as "isCompleted", due_date as "dueDate" FROM tasks')
        tasks = cur.fetchall()
    return JSONResponse(content=jsonable_encoder(tasks))

@app.patch("/api/tasks/{task_id}")
async def toggle_task(task_id: int, task_update: TaskToggle):
    with closing(conn.cursor()) as cur:
        cur.execute(
            'UPDATE tasks SET is_completed = ? WHERE id = ?',
            (task_update.isCompleted, task_id)
        )
        conn.commit()
        cur.execute('SELECT id, title, is_completed as "isCompleted", due_date as "dueDate" FROM tasks WHERE id = ?', (task_id,))
        task = cur.fetchone()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
    return JSONResponse(content=jsonable_encoder(task))

# Chat
@app.get("/api/chat/history")
async def get_chat_history():
    with closing(conn.cursor()) as cur:
        cur.execute("SELECT * FROM messages ORDER BY timestamp ASC")
        messages = cur.fetchall()
    return JSONResponse(content=jsonable_encoder(messages))

@app.post("/api/chat")
async def send_chat(request: ChatRequest):
    # Save user message
    with closing(conn.cursor()) as cur:
        cur.execute("INSERT INTO messages (content, role, timestamp) VALUES (?, ?, ?)", (request.content, 'user', datetime.now()))
        conn.commit()

    # Generate AI response
    ai_text = "I'm sorry, I can't connect to the gardening brain right now."
    if genai_client:
        try:
            # Fetch conversation history
            with closing(conn.cursor()) as cur:
                cur.execute("SELECT role, content FROM messages ORDER BY timestamp DESC LIMIT 20")
                history = cur.fetchall()

            chat_contents = []
            for msg in reversed(history):
                role = "model" if msg["role"] == "assistant" else "user"
                chat_contents.append(types.Content(role=role, parts=[types.Part.from_text(text=msg["content"])]))

            response = genai_client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=chat_contents,
                config=types.GenerateContentConfig(
                    system_instruction="You are Olivia, a helpful AI assistant specialized in gardening. Provide concise and accurate information to help users take care of their plants."
                )
            )
            ai_text = response.text
        except Exception as e:
            print(f"Gemini Error: {e}")

    # Save AI message
    with closing(conn.cursor()) as cur:
        cur.execute("INSERT INTO messages (content, role, timestamp) VALUES (?, ?, ?)", (ai_text, 'assistant', datetime.now()))
        message_id = cur.lastrowid
        conn.commit()
        cur.execute("SELECT * FROM messages WHERE id = ?", (message_id,))
        ai_message = cur.fetchone()
    
    return JSONResponse(content=jsonable_encoder(ai_message))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)