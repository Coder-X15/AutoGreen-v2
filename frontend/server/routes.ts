import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const genaiClient = new GoogleGenAI({
  apiKey : apiKey || ""
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth (Mock)
  app.post(api.auth.login.path, async (req, res) => {
    const { username, password } = req.body;
    let user = await storage.getUserByUsername(username);
    
    // If user doesn't exist, create one (Mock auto-registration)
    if (!user) {
      user = await storage.createUser({
        username,
        password, // In a real app, hash this
        email: `${username}@example.com`,
        organization: "Home Garden"
      });
    } else if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json(user);
  });

  app.get(api.auth.getUser.path, async (req, res) => {
    const user = await storage.getUser(parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  app.put(api.auth.updateProfile.path, async (req, res) => {
    try {
      const updated = await storage.updateUser(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (e) {
      res.status(404).json({ message: "User not found" });
    }
  });

  // Plants
  app.get(api.plants.list.path, async (req, res) => {
    const plants = await storage.getPlants();
    res.json(plants);
  });

  app.get(api.plants.get.path, async (req, res) => {
    const plant = await storage.getPlant(parseInt(req.params.id));
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json(plant);
  });

  // Trends
  app.get(api.trends.list.path, async (req, res) => {
    const trends = await storage.getTrends();
    res.json(trends);
  });

  // Tasks
  app.get(api.tasks.list.path, async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.patch(api.tasks.toggle.path, async (req, res) => {
    try {
      const task = await storage.toggleTask(parseInt(req.params.id), req.body.isCompleted);
      res.json(task);
    } catch (e) {
      res.status(404).json({ message: "Task not found" });
    }
  });

  // Chat
  app.get(api.chat.history.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post(api.chat.send.path, async (req, res) => {
    // Save user message
    await storage.createMessage({
      content: req.body.content,
      role: 'user',
      timestamp: new Date()
    } as any);

    const user_message = req.body.content;

    // This is how you provide context in a chat with Gemini 3
    const response = await genaiClient.models.generateContent(
        {
          model: "gemini-3-flash-preview",
          contents : [
            {
              "role" : "system",
              "parts" : [{
                "text" : "You are Olivia, a helpful AI assistant specialized in gardening. Provide concise and accurate information to help users take care of their plants."
              }]
            },
            {
              "role" : "user",
              "parts" : [{
                "text" : user_message
              }]
            }
          ]
        }
      )

    // Mock AI response
    // In future, connect to OpenAI here
    const aiResponse = await storage.createMessage({
      content: response.text,
      role: 'assistant',
      timestamp: new Date()
    } as any);

    res.json(aiResponse);
  });

  return httpServer;
}
