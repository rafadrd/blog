import pool from "../db/index.js";

export const setupShutdown = (server) => {
  const shutdown = () => {
    console.log("\n[Shutdown] SIGTERM/SIGINT received. Closing...");

    server.close(async () => {
      console.log("[Shutdown] HTTP server closed.");
      await pool.end();
      console.log("[Shutdown] Database connection closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};
