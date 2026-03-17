import React from 'react';
import '../styles/SpotLight.css';

const SpotLight = ({ title, subtitle, spotlightImage, buttonText, buttonUrl, align = 'center' }) => {
   const getImageUrl = (image) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (image.asset?.url) return image.asset.url;
    if (image.url) return image.url;

    const ref = image.asset?._ref;
    if (typeof ref === 'string') {
      const cleaned = ref
        .replace(/^image-/, '')
        .replace(/-([a-z]+)$/, '.$1');
      return `https://cdn.sanity.io/images/4p1xt2z5/rlthub/${cleaned}`;
    }

    return '';
  };

  const imageUrl = getImageUrl(spotlightImage);


  return (
    <section className="spotlight-section">
      {title && <h1 className="spotlight-title">{title}</h1>}
      {subtitle && <p className="spotlight-subtitle">{subtitle}</p>}
      {buttonText && buttonUrl && (
        <a href={buttonUrl} className="spotlight-button">
          {buttonText}
        </a>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="spotlight-image"
        />
      )}
    </section>
  );
};

export default SpotLight;
