import React from 'react';
import '../styles/FeaturesSection.css';

const FeaturesSection = ({ title, subtitle, features = [], columns = 3 }) => {

  const getImageUrl = (image) => {
    if (!image) return '';

    if (typeof image === 'string') return image;

    if (image.asset?.url) return image.asset.url;

    const ref = image.asset?._ref;

    if (ref) {
      const cleaned = ref
        .replace(/^image-/, '')
        .replace(/-([a-z]+)$/, '.$1');

      return `https://cdn.sanity.io/images/4p1xt2z5/rlthub/${cleaned}`;
    }

    return '';
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <section className="features-section">
      {title && <h2 className="features-title">{title}</h2>}
      {subtitle && <p className="features-subtitle">{subtitle}</p>}

      <div className="features-grid" style={gridStyle}>
        {(features || []).map((f, idx) => {

          const imageUrl = getImageUrl(f.image);

          return (
            <div key={idx} className="feature-item">

              {f.icon && <div className="feature-icon">{f.icon}</div>}

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={f.title || ''}
                  className="feature-image"
                  onError={(e) => {
                    console.warn('Feature image failed to load', f.image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}

              {f.title && <h3 className="feature-item-title">{f.title}</h3>}

              {f.description && (
                <p className="feature-item-desc">{f.description}</p>
              )}

            </div>
          );

        })}
      </div>
    </section>
  );
};

export default FeaturesSection;