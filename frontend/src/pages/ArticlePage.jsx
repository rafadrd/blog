import { useParams } from "react-router-dom";
import { fetchArticleById } from "../api/client";
import { useFetch } from "../hooks/useFetch";

export default function ArticlePage() {
  const { id } = useParams();
  const {
    data: article,
    loading,
    error,
  } = useFetch(() => fetchArticleById(id), [id]);

  if (loading) return <div className="status">Loading...</div>;
  if (error) return <div className="status error">Error: {error}</div>;
  if (!article) return <div className="status">Article not found</div>;

  return (
    <article className="article">
      <header>
        <h1>{article.title}</h1>
        <small className="article-meta">
          {new Date(article.created_at).toLocaleDateString()}
        </small>
      </header>

      <div className="article-body">{article.content}</div>
    </article>
  );
}
