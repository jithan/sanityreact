import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '../sanityClient';
import { PortableText } from '@portabletext/react';
import KalturaVideoPlayer from '../components/KalturaVideoPlayer';
import './ArticleDetail.css';

function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "article" && slug.current == $slug][0] {
            _id,
            title,
            slug,
            excerpt,
            content,
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
              },
              bio
            },
            tags,
            kalturaVideo
          }
        `, { slug });

        if (!data) {
          setError('Article not found');
          setLoading(false);
          return;
        }

        setArticle(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const portableTextComponents = {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h1: ({ children }) => <h1>{children}</h1>,
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
    },
  };

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/articles')}>Back to Articles</button>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="error">
        <p>Article not found</p>
        <button onClick={() => navigate('/articles')}>Back to Articles</button>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      <button className="back-button" onClick={() => navigate('/articles')}>
        ← Back to Articles
      </button>

      <article className="article-detail">
        <header className="article-header">
          <h1>{article.title}</h1>
          <div className="article-header-meta">
            {article.author && (
              <div className="author-info">
                {article.author.image && (
                  <img 
                    src={article.author.image.asset.url} 
                    alt={article.author.name}
                    className="author-image"
                  />
                )}
                <div>
                  <span className="author-name">{article.author.name}</span>
                  {article.author.bio && (
                    <p className="author-bio">{article.author.bio}</p>
                  )}
                </div>
              </div>
            )}
            {article.publishedAt && (
              <span className="published-date">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </header>

        {article.mainImage && (
          <figure className="article-main-image">
            <img 
              src={article.mainImage.asset.url} 
              alt={article.mainImage.alt || article.title}
            />
          </figure>
        )}

        {article.excerpt && (
          <div className="article-excerpt">
            <p>{article.excerpt}</p>
          </div>
        )}

        {article.kalturaVideo && (
          <div className="kaltura-video-section">
            {article.kalturaVideo.title && (
              <h2>{article.kalturaVideo.title}</h2>
            )}
            <KalturaVideoPlayer
              kalturaId={article.kalturaVideo.videoId}
              partnerId={article.kalturaVideo.partnerId}
              playerSize={{
                width: article.kalturaVideo.width ? `${article.kalturaVideo.width}px` : '100%',
                height: article.kalturaVideo.height ? `${article.kalturaVideo.height}px` : '500px'
              }}
            />
            {article.kalturaVideo.caption && (
              <p className="video-caption">{article.kalturaVideo.caption}</p>
            )}
          </div>
        )}

        <div className="article-body">
          {article.content ? (
            <PortableText 
              value={article.content}
              components={portableTextComponents}
            />
          ) : (
            <p>No content available</p>
          )}
        </div>

        {article.tags && article.tags.length > 0 && (
          <footer className="article-footer">
            <div className="tags">
              <span className="tags-label">Tags:</span>
              {article.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}

export default ArticleDetail;
