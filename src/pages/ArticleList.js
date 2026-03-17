import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient';
import './ArticleList.css';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "article"] | order(publishedAt desc) {
            _id,
            title,
            slug,
            excerpt,
            publishedAt,
            mainImage {
              asset -> {
                url,
                metadata {
                  dimensions {
                    height,
                    width
                  }
                }
              },
              alt,
              hotspot
            },
            author -> {
              name,
              image {
                asset -> {
                  url
                }
              }
            }
          }
        `);
        setArticles(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="loading">Loading articles...</div>;
  }

  if (error) {
    return <div className="error">Error loading articles: {error}</div>;
  }

  if (articles.length === 0) {
    return <div className="no-articles">No articles found.</div>;
  }

  return (
    <div className="articles-container">
      <h1>Articles</h1>
      <div className="articles-grid">
        {articles.map((article) => (
          <Link 
            key={article._id} 
            to={`/articles/${article.slug.current}`}
            className="article-card-link"
          >
            <div className="article-card">
              {article.mainImage && (
                <div className="article-image">
                  <img 
                    src={article.mainImage.asset.url} 
                    alt={article.mainImage.alt || article.title}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="article-content">
                <h2>{article.title}</h2>
                {article.excerpt && (
                  <p className="excerpt">{article.excerpt}</p>
                )}
                <div className="article-meta">
                  {article.author && (
                    <span className="author">By {article.author.name}</span>
                  )}
                  {article.publishedAt && (
                    <span className="date">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArticleList;
