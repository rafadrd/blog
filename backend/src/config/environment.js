import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key) => {
  const value = process.env[key];
  if (value === undefined || value === null) {
    console.error(`[FATAL] Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(requireEnv("PORT"), 10),
  frontendUrl: requireEnv("FRONTEND_URL"),
  databaseUrl: requireEnv("DATABASE_URL"),
  openRouterApiKey: requireEnv("OPENROUTER_API_KEY"),
  aiModelName: process.env.AI_MODEL_NAME || "openai/gpt-oss-20b:free",
  openRouterApiUrl:
    process.env.OPENROUTER_API_URL ||
    "https://openrouter.ai/api/v1/chat/completions",
  cronSchedule: process.env.CRON_SCHEDULE || "0 0 * * *",
  articleTopics: process.env.ARTICLE_TOPICS,
};
