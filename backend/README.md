# FastAPI Server Migration

This directory contains the migrated server logic from the original TypeScript-based Express server to a Python-based FastAPI server.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Static Files**:
   Ensure the `frontend/client/public` directory exists and contains the necessary static files. These will be served at `/static`.

5. **Database**:
   The server uses a SQLite database (`agro.db`). It will be created automatically if it doesn't exist, but you may need to initialize the schema.

## Features

- **Authentication**:
  - Login endpoint (`/api/auth/login`)
  - Fetch user by ID (`/api/auth/user/{user_id}`)
  - Update user profile (`/api/auth/user/{user_id}`)

- **Static File Serving**:
  - Files in `frontend/client/public` are served at `/static`.

- **Database Integration**:
  - SQLite connection using `sqlite3`.

## Notes

- Additional routes and logic from the original server can be added to `app/main.py`.
- Ensure the database schema matches the expected structure in the code.
- For production, configure a proper ASGI server like Daphne or Hypercorn.