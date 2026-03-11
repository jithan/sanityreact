import React from 'react';
import { PortableText } from '@portabletext/react';
import '../styles/ContactCallout.css';

const ContactCallout = ({ title, description, buttonText, buttonUrl, buttonTarget = '_self' }) => {
  return (
    <section className="contact-callout">
      <div className="contact-callout__content">
        <div className="callout-body">
          <div className="callout-body-left">
            {title && <h2 className="contact-callout__title">{title}</h2>}
          </div>
          <div className="callout-body-right">
            {description && (
              <div className="contact-callout__description">
                <PortableText value={description} />
              </div>
            )}
            {buttonText && buttonUrl && (
              <a
                href={buttonUrl}
                target={buttonTarget}
                rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
                className="contact-callout__button"
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCallout;
