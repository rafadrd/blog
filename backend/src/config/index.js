import { env } from "./environment.js";
import { topics } from "./topics.js";

export const config = {
  server: {
    port: env.port,
    env: env.nodeEnv,
    frontendUrl: env.frontendUrl,
  },
  db: {
    url: env.databaseUrl,
  },
  ai: {
    key: env.openRouterApiKey,
    model: env.aiModelName,
    url: env.openRouterApiUrl,
  },
  scheduler: {
    cronExpression: env.cronSchedule,
  },
  topics: topics,
};
