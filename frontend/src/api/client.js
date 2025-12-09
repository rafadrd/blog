const API_BASE = import.meta.env.VITE_API_URL || "/api";

const request = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API] Request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const fetchArticles = () => request("/articles");
export const fetchArticleById = (id) => request(`/articles/${id}`);
