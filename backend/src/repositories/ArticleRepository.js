import pool from "../db/index.js";

class ArticleRepository {
  static async findAll() {
    const query =
      "SELECT id, title, created_at FROM articles ORDER BY created_at DESC";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = "SELECT * FROM articles WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async create(title, content) {
    const query =
      "INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *";
    const { rows } = await pool.query(query, [title, content]);
    return rows[0];
  }

  static async count() {
    const query = "SELECT COUNT(*) FROM articles";
    const { rows } = await pool.query(query);
    return parseInt(rows[0].count, 10);
  }
}

export default ArticleRepository;
