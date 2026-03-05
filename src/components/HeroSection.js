import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = ({ title, subtitle, backgroundImage, ctaText, ctaUrl, align = 'center' }) => {
  const bgUrl = backgroundImage?.asset?.url || '';
  if (!bgUrl && backgroundImage) {
    console.warn('HeroSection backgroundImage missing url', backgroundImage);
  }
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
