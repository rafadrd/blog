import express from "express";
import cors from "cors";
import { config } from "./config/index.js";
import articleRoutes from "./routes/articles.js";

const app = express();

app.use(
  cors({
    origin: config.server.frontendUrl,
    methods: ["GET"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/articles", articleRoutes);

export default app;
