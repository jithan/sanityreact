import React from "react";
import "../styles/SpotlightContentService.css";

const SpotlightContentService = ({
  spotlight_content,
  field_component_id,
  data_id_for_anchor_linking,
  title,
  background_color,
  image_alignment,
  image,
  logo_or_service_pillar,
  link
}) => {
  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.asset?.url) return image.asset.url;

    const ref = image.asset?._ref;
    if (ref) {
      const cleaned = ref
        .replace("image-", "")
        .replace(/-([a-z]+)$/, ".$1");

      return `https://cdn.sanity.io/images/4p1xt2z5/rlthub/${cleaned}`;
    }

    return "";
  };

  const mainImageUrl = getImageUrl(image);
  const logoUrl = getImageUrl(logo_or_service_pillar);

  const bgClass = background_color ? `bg-${background_color}` : 'bg-white';
  const alignClass = image_alignment ? `align-${image_alignment}` : 'align-right';

  return (
    <section
      className={`spotlight-content-service ${bgClass} ${alignClass}`}
      id={data_id_for_anchor_linking}
    >
      <div className="spotlight-container">
        <div className="spotlight-content">
          {logoUrl && (
            <img
              src={logoUrl}
              alt={logo_or_service_pillar?.alt || ""}
              className="spotlight-logo"
            />
          )}

          {title && <h2 className="spotlight-title">{title}</h2>}

          {link?.label && link?.url && (
            <a
              href={link.url}
              className="spotlight-cta"
              target={link.openInNewTab ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          )}
        </div>

        {mainImageUrl && (
          <div className="spotlight-image">
            <img src={mainImageUrl} alt={image?.alt || ""} />
          </div>
        )}
      </div>
    </section>
  );
};

export default SpotlightContentService;