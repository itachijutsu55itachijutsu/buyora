import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  dialect: "postgresql",           // Database type
  dbCredentials: { url: env.DB_URL }, // Connection string
  schema: "./src/db/schema.ts",    // Where tables are defined
  out: "./drizzle",                // Where migrations go
});