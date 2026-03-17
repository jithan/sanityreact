import React from "react";
import "../styles/CustomImage.css";

const CustomImage = ({ image, alt }) => {
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

  const imageUrl = getImageUrl(image);

  if (!imageUrl) return null;

  return (
    <div className="custom-image">
      <img src={imageUrl} alt={alt || ""} />
    </div>
  );
};

export default CustomImage;