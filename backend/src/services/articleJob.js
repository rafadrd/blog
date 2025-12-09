import cron from "node-cron";
import ArticleRepository from "../repositories/ArticleRepository.js";
import { generateContent } from "./aiClient.js";
import { config } from "../config/index.js";

const MIN_ARTICLES_TO_SEED = 3;

const createDailyArticle = async () => {
  if (config.topics.length === 0) {
    console.warn("[Job] No topics configured. Skipping article generation.");
    return;
  }

  const topic = config.topics[Math.floor(Math.random() * config.topics.length)];
  console.log(`[Job] Starting generation for: "${topic}"...`);

  try {
    const content = await generateContent(topic);
    await ArticleRepository.create(topic, content);
    console.log(`[Job] Article created successfully: "${topic}"`);
  } catch (err) {
    console.error(`[Job] Failed: ${err.message}`);
  }
};

const seedInitialData = async () => {
  try {
    const count = await ArticleRepository.count();

    if (count < MIN_ARTICLES_TO_SEED) {
      const needed = MIN_ARTICLES_TO_SEED - count;
      console.log(
        `[Seed] Database has ${count} articles. Seeding ${needed} more...`,
      );

      for (let i = 0; i < needed; i++) {
        await createDailyArticle();
      }
      console.log("[Seed] Seeding complete.");
    }
  } catch (error) {
    console.error("[Seed] Error during initial seeding:", error);
  }
};

export const startScheduler = () => {
  console.log(
    `[Scheduler] Initialized with schedule: "${config.scheduler.cronExpression}"`,
  );
  cron.schedule(config.scheduler.cronExpression, createDailyArticle);

  seedInitialData();
};
