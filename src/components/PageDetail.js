import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '../sanityClient';
import { PortableText } from '@portabletext/react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import SplitImageSection from './SplitImageSection';
import TextSection from './TextSection';
import '../styles/PageDetail.css';

function PageDetail() {
  let { slug } = useParams();
  if (!slug) {
    slug = 'home'; // default to home when no slug provided
  }
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "page" && slug.current == $slug][0] {
            _id,
            title,
            slug,
            content[]{
              ..., // preserve other block fields
              hero{backgroundImage{asset->{url}}, ...},
              features{features[]{image{asset->{url}}, ...}},
              splitImage{image{asset->{url}}, ...},
            },
            seo {
              metaTitle,
              metaDescription,
              ogImage {
                asset -> {
                  url
                }
              }
            }
          }
        `, { slug });

        if (!data) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        setPage(data);
        console.log('fetched page data', data);
        setLoading(false);

        // Update document title if SEO metaTitle is available
        if (data.seo?.metaTitle) {
          document.title = data.seo.metaTitle;
        } else {
          document.title = data.title;
        }

        // Update meta description if available
        if (data.seo?.metaDescription) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.seo.metaDescription);
          } else {
            const newMeta = document.createElement('meta');
            newMeta.name = 'description';
            newMeta.content = data.seo.metaDescription;
            document.head.appendChild(newMeta);
          }
        }

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPage();
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
      link: ({ children, value }) => (
        <a href={value.href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
    },
    types: {
      image: ({ value }) => (
        <figure className="page-image">
          <img
            src={value.asset.url}
            alt={value.alt || ''}
            loading="lazy"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ),
      hero: ({ value }) => <HeroSection {...value} />,
      features: ({ value }) => <FeaturesSection {...value} />,
      splitImage: ({ value }) => <SplitImageSection {...value} />,
      textSection: ({ value }) => <TextSection {...value} />,
    },
  };

  if (loading) {
    return <div className="loading">Loading page...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="error">
        <p>Page not found</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="page-detail-container">
      <article className="page-detail">
        <header className="page-header">
          <h1>{page.title}</h1>
        </header>

        <div className="page-content">
          {page.content ? (
            <PortableText
              value={page.content}
              components={portableTextComponents}
            />
          ) : (
            <p>No content available</p>
          )}
        </div>
      </article>
    </div>
  );
}

export default PageDetail;