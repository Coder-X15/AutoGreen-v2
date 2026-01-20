import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Default to a dummy connection string if not present to avoid crashing 
// when the user hasn't set up the DB yet, since they asked for a boilerplate.
// In a real app, we'd throw.
const connectionString = process.env.DATABASE_URL || "postgres://user:password@localhost:5432/dbname";

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
