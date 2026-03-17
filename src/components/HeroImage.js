import React from "react";
import { PortableText } from "@portabletext/react";
import "../styles/HeroSection.css";

const HeroImage = ({
  field_component_title,
  field_component_title_eyebrow,
  field_component_description,
  field_link,
  field_component_list_image_alignment,
  image_field,
  logo_service_pillar_sm,
  data_id_for_anchor_linking
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

  const heroImage = getImageUrl(image_field);
  const logoUrl = getImageUrl(logo_service_pillar_sm);
const ctaText = field_link?.label;
const ctaUrl = field_link?.url;
const newTab = field_link?.openInNewTab;

  const alignment = field_component_list_image_alignment || "right";

  return (
    <section
      className={`heroimage-section hero-${alignment}`}
      id={data_id_for_anchor_linking}
    >

      <div className="hero-content">

        {logoUrl && (
          <img
            src={logoUrl}
            alt={logo_service_pillar_sm?.alt || ""}
            className="hero-logo"
          />
        )}

        {field_component_title_eyebrow && (
          <span className="hero-eyebrow">
            {field_component_title_eyebrow}
          </span>
        )}

        <h1 className="hero-title">
          {field_component_title}
        </h1>

        {field_component_description && (
          <div className="hero-description">
            <PortableText value={field_component_description} />
          </div>
        )}
{ctaText && ctaUrl && (
  <a
    href={ctaUrl}
    className="hero-cta"
    target={newTab ? "_blank" : "_self"}
    rel="noopener noreferrer"
  >
    {ctaText}
  </a>
)}

      </div>

      {heroImage && (
        <div className="hero-image">
          <img src={heroImage} alt={image_field?.alt || ""} />
        </div>
      )}

    </section>
  );
};

export default HeroImage;