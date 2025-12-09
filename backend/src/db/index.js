import pg from "pg";
import { config } from "../config/index.js";

const { Pool } = pg;

const pool = new Pool({ connectionString: config.db.url });

pool.on("error", (err, _) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

export default pool;
