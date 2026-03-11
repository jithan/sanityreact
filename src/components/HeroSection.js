import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = ({ title, subtitle, backgroundImage, ctaText, ctaUrl, align = 'center' }) => {
  const getBgUrl = (image) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (image.asset?.url) return image.asset.url;
    if (image.url) return image.url;

    const ref = image.asset?._ref;
    if (typeof ref === 'string') {
      // sanity image ref format: image-<id>-<width>x<height>-<format>
      const cleaned = ref
        .replace(/^image-/, '')
        .replace(/-([a-z]+)$/, '.$1');
      return `https://cdn.sanity.io/images/4p1xt2z5/rlthub/${cleaned}`;
    }

    return '';
  };

  const bgUrl = getBgUrl(backgroundImage);

  const style = {
    textAlign: align,
    backgroundImage: bgUrl ? `url(${bgUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '100px 20px',
    color: '#fff',
  };

  return (
    <section className="hero-section" style={style}>
      {title && <h1 className="hero-title">{title}</h1>}
      {subtitle && <p className="hero-subtitle">{subtitle}</p>}
      {ctaText && ctaUrl && (
        <a href={ctaUrl} className="hero-cta">
          {ctaText}
        </a>
      )}
    </section>
  );
};

export default HeroSection;
