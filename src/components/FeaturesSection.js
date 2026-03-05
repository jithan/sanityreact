import React from 'react';
import '../styles/FeaturesSection.css';

const FeaturesSection = ({ title, subtitle, features = [], columns = 3 }) => {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <section className="features-section">
      {title && <h2 className="features-title">{title}</h2>}
      {subtitle && <p className="features-subtitle">{subtitle}</p>}
      <div className="features-grid" style={gridStyle}>
        {(features || []).map((f, idx) => (
          <div key={idx} className="feature-item">
            {f.icon && <div className="feature-icon">{f.icon}</div>}
            {f.image && (
              <img
                src={
                  f.image.asset?.url || ''
                }
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
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
