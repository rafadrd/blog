import pool from "./index.js";

export const initDB = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("Database schema initialized.");
  } catch (error) {
    console.error("Database schema initialization failed:", error);
    throw error;
  }
};
