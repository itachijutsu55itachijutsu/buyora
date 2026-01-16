// db/index.ts

// STEP 1: Import tools
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import { env } from "../config/env";

// STEP 2: Check if DB_URL exists
if (!env.DB_URL) { throw new Error("DB_URL is not set in environment variables");

}

// STEP 3: Create connection pool (the magnet starts working)
const pool = new Pool({ connectionString: env.DB_URL });

// STEP 4: Add logs (optional)
pool.on("connect", () => { console.log("Database connected successfully ✅");
});
pool.on("error", (err) => { console.error("💥 Database connection error:", err);
});

// STEP 5: Export db instance
export const db = drizzle({  client: pool,  schema });