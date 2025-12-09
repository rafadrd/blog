import { Router } from "express";
import ArticleRepository from "../repositories/ArticleRepository.js";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const articles = await ArticleRepository.findAll();
    res.json(articles);
  } catch (e) {
    console.error("Error fetching articles:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await ArticleRepository.findById(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (e) {
    console.error(`Error fetching article ${req.params.id}:`, e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
