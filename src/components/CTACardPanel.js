import React from 'react';
import { PortableText } from '@portabletext/react';
import '../styles/CTACardPanel.css';

const resolveImageUrl = (image) => {
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

const CTACardPanel = ({
  componentId,
  colorVariant = 'default',
  eyebrow,
  headline,
  description,
  primaryButton,
  cards = [],
}) => {
  const sectionClass = `cta-card-panel cta-card-panel--${colorVariant}`;

  return (
    <section id={componentId} className={sectionClass}>
      <div className="cta-card-panel__content">
        {eyebrow && <p className="cta-card-panel__eyebrow">{eyebrow}</p>}
        {headline && <h2 className="cta-card-panel__headline">{headline}</h2>}
        {description && (
          <div className="cta-card-panel__description">
            <PortableText value={description} />
          </div>
        )}
        {primaryButton?.label && primaryButton?.url && (
          <a
            href={primaryButton.url}
            target={primaryButton.target || '_self'}
            rel={primaryButton.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="cta-card-panel__primary-button"
          >
            {primaryButton.label}
          </a>
        )}
      </div>

      {cards.length > 0 && (
        <div className="cta-card-panel__grid">
          {cards.map((card, idx) => {
            const imageUrl = resolveImageUrl(card.image);
            return (
              <article key={card._key || idx} className="cta-card-panel__card">
                {imageUrl && (
                  <div className="cta-card-panel__card-image">
                    <img src={imageUrl} alt={card.title || 'Card image'} />
                  </div>
                )}
                {card.title && <h3 className="cta-card-panel__card-title">{card.title}</h3>}
                {card.description && <p className="cta-card-panel__card-description">{card.description}</p>}
                {card.link?.url && (
                  <a
                    href={card.link.url}
                    target={card.link.target || '_self'}
                    rel={card.link.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className="cta-card-panel__card-link"
                  >
                    {card.link.label || 'Learn more'}
                  </a>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CTACardPanel;
