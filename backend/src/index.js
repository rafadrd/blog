import app from "./app.js";
import { config } from "./config/index.js";
import { initDB } from "./db/schema.js";
import { startScheduler } from "./services/articleJob.js";
import { setupShutdown } from "./utils/shutdown.js";

const startServer = async () => {
  try {
    await initDB();

    const server = app.listen(config.server.port, () => {
      console.log(`Backend running on port ${config.server.port}`);
      console.log(`Environment: ${config.server.env}`);
      startScheduler();
    });

    setupShutdown(server);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
