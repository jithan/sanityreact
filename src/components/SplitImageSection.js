import React from 'react';
import '../styles/SplitImageSection.css';

const SplitImageSection = ({ title, content, image, imagePosition = 'right', ctaText, ctaUrl }) => {
  const isLeft = imagePosition === 'left';

  return (
    <section className={`split-image-section ${isLeft ? 'image-left' : 'image-right'}`}>
      {image && (
        <div className="split-image-container">
          <img src={image.asset.url} alt={title || ''} className="split-image" />
        </div>
      )}
      <div className="split-text">
        {title && <h2>{title}</h2>}
        {content && <div className="split-content">{content}</div>}
        {ctaText && ctaUrl && (
          <a href={ctaUrl} className="split-cta">
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

export default SplitImageSection;