import React, { useEffect, useState } from "react";
import "../styles/AnchorLinks.css";

const AnchorLinks = ({ items }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // If a hash is present on load, try to activate the matching item
    const hash = window.location.hash;
    if (!hash) return;

    const foundIndex = safeItems.findIndex((item) => item.componentId === hash);
    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    }
  }, [safeItems]);

  if (!safeItems.length) return null;

  const scrollToSection = (componentId, index) => {
    const element = document.querySelector(componentId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveIndex(index);
      window.history.replaceState(null, "", componentId);
    }
  };

  return (
    <nav className="anchor-links">
      <div className="anchor-links-container">
        {items.map((item, index) => (
          <button
            key={index}
            className={`anchor-link-item ${index === activeIndex ? "active" : ""}`}
            onClick={() => scrollToSection(item.componentId, index)}
            type="button"
          >
            {item.linkText}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default AnchorLinks;