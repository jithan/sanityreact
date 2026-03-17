import React from "react";
import "../styles/FullwidthImage.css";

const FullwidthImage = ({
  field_component_id,
  data_id_for_anchor_linking,
  image_padding,
  image_full_width,
  disclaimer
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

  const imageUrl = getImageUrl(image_full_width);

  if (!imageUrl) return null;

  const padding = image_padding || '80px';

  return (
    <section
      className="fullwidth-image"
      id={data_id_for_anchor_linking}
      style={{ paddingTop: padding, paddingBottom: padding }}
    >
      <div className="fullwidth-image-container">
        <img
          src={imageUrl}
          alt={image_full_width?.alt || ""}
          className="fullwidth-image-img"
        />
        {disclaimer && (
          <div className="fullwidth-image-disclaimer">
            <p>{disclaimer}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FullwidthImage;