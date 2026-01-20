import { 
  users, plants, trends, tasks, messages,
  type User, type InsertUser, 
  type Plant, type InsertPlant,
  type Trend, type Task, type Message
} from "@shared/schema";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  // Plants
  getPlants(): Promise<Plant[]>;
  getPlant(id: number): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;

  // Trends
  getTrends(): Promise<Trend[]>;
  createTrend(trend: Trend): Promise<Trend>;

  // Tasks
  getTasks(): Promise<Task[]>;
  createTask(task: Task): Promise<Task>;
  toggleTask(id: number, isCompleted: boolean): Promise<Task>;

  // Chat
  getMessages(): Promise<Message[]>;
  createMessage(message: Message): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plants: Map<number, Plant>;
  private trends: Map<number, Trend>;
  private tasks: Map<number, Task>;
  private messages: Map<number, Message>;
  
  private currentUserId: number;
  private currentPlantId: number;
  private currentTrendId: number;
  private currentTaskId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.plants = new Map();
    this.trends = new Map();
    this.tasks = new Map();
    this.messages = new Map();
    
    this.currentUserId = 1;
    this.currentPlantId = 1;
    this.currentTrendId = 1;
    this.currentTaskId = 1;
    this.currentMessageId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed User
    this.createUser({ 
      username: "user", 
      password: "password", 
      email: "user@greenhouse.com", 
      organization: "Home Garden" 
    });

    // Seed Plants
    this.createPlant({ name: "Monstera", species: "Monstera Deliciosa", healthStatus: "Good", imageUrl: null });
    this.createPlant({ name: "Snake Plant", species: "Sansevieria", healthStatus: "Needs Water", imageUrl: null });
    this.createPlant({ name: "Fiddle Leaf", species: "Ficus Lyrata", healthStatus: "Good", imageUrl: null });

    // Seed Trends
    this.createTrend({ 
      title: "Vertical Gardening", 
      description: "Maximizing space with vertical planters is the hottest trend of 2024.", 
      sourceUrl: "https://example.com/vertical",
      imageUrl: null 
    } as Trend);
    this.createTrend({ 
      title: "Native Plants", 
      description: "Choosing local species to support local ecosystems.", 
      sourceUrl: "https://example.com/native",
      imageUrl: null 
    } as Trend);

    // Seed Tasks
    this.createTask({ title: "Water the Fiddle Leaf", isCompleted: false, dueDate: new Date() } as Task);
    this.createTask({ title: "Fertilize Tomatoes", isCompleted: true, dueDate: new Date() } as Task);
    this.createTask({ title: "Check pH Levels", isCompleted: false, dueDate: new Date() } as Task);

    // Seed Messages
    this.createMessage({ content: "Hello! I'm Olivia, your gardening assistant. How can I help you today?", role: "assistant", timestamp: new Date() } as Message);
  }

  // User
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, email: insertUser.email ?? null, organization: insertUser.organization ?? null };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Plants
  async getPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(plant: InsertPlant): Promise<Plant> {
    const id = this.currentPlantId++;
    const newPlant: Plant = { ...plant, id, imageUrl: plant.imageUrl ?? null };
    this.plants.set(id, newPlant);
    return newPlant;
  }

  // Trends
  async getTrends(): Promise<Trend[]> {
    return Array.from(this.trends.values());
  }

  async createTrend(trend: Trend): Promise<Trend> { // Simplified for seed
    const id = this.currentTrendId++;
    const newTrend: Trend = { ...trend, id };
    this.trends.set(id, newTrend);
    return newTrend;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(task: Task): Promise<Task> { // Simplified
    const id = this.currentTaskId++;
    const newTask: Task = { ...task, id };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async toggleTask(id: number, isCompleted: boolean): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error("Task not found");
    const updatedTask = { ...task, isCompleted };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  // Chat
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => 
      (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
    );
  }

  async createMessage(message: Message): Promise<Message> { // Simplified
    const id = this.currentMessageId++;
    const newMessage: Message = { ...message, id, timestamp: new Date() };
    this.messages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
