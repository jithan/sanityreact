import React from 'react';
import '../styles/TextSection.css';

const TextSection = ({ title, content, backgroundColor = 'white', textAlign = 'left' }) => {
  const style = {
    backgroundColor: backgroundColor === 'white' ? '#fff' : backgroundColor === 'gray-50' ? '#f9f9f9' : '#333',
    color: backgroundColor === 'gray-900' ? '#fff' : '#333',
    textAlign,
    padding: '60px 20px',
  };

  return (
    <section className="text-section" style={style}>
      {title && <h2 className="text-section-title">{title}</h2>}
      {content && <div className="text-section-content">{content}</div>}
    </section>
  );
};

export default TextSection;