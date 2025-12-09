import { fetchArticles } from "../api/client";
import { useFetch } from "../hooks/useFetch";
import ArticleCard from "../components/ArticleCard";

export default function Home() {
  const { data: articles, loading, error } = useFetch(fetchArticles);

  if (loading) return <div className="status">Loading articles...</div>;
  if (error) return <div className="status error">Error: {error}</div>;

  return (
    <div>
      <h1>Latest Articles</h1>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
