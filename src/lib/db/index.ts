import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.includes("user:password")) {
    return null; // Neon DB not configured, use in-memory/browser fallback
  }

  if (!dbInstance) {
    try {
      const sql = neon(connectionString);
      dbInstance = drizzle(sql, { schema });
    } catch (err) {
      console.warn("Failed to initialize Neon DB connection, operating in fallback mode:", err);
      return null;
    }
  }

  return dbInstance;
}
