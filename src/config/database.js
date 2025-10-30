// src/config/database.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const { Pool } = pkg;

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in your .env file");
  process.exit(1);
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon, Supabase, or any cloud PostgreSQL
  },
});

// Test the connection immediately
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL (Neon):", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

export default pool;
