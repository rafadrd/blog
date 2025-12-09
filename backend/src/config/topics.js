import { env } from "./environment.js";

const defaultTopics = [
  "The hidden costs of Serverless",
  "Kubernetes vs Docker Swarm",
  "The future of React",
  "PostgreSQL optimization tips",
  "AI in Software Engineering",
  "Rust for Web Development",
];

const getTopics = () => {
  const envTopics = env.articleTopics;
  if (envTopics && envTopics.trim() !== "") {
    return envTopics.split(",").map((topic) => topic.trim());
  }
  return defaultTopics;
};

export const topics = getTopics();
