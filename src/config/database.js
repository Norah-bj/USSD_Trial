// src/config/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Important for Neon
  },
});

// pool
//   .connect()
//   .then(() => console.log("✅ Connected to Neon PostgreSQL"))
//   .catch((err) => console.error("❌ DB connection error:", err));

// Test connection immediately
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL (Neon):", res.rows[0].now);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

export default pool;
