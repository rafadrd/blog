import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const date = new Date(article.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link to={`/article/${article.id}`} className="card">
      <h2>{article.title}</h2>
      <small>{date}</small>
    </Link>
  );
}
