import React from "react";
import CustomImage from "./CustomImage";
import HTMLBlock from "./HTMLBlock";
import "../styles/TwoColumn.css";

const TwoColumn = ({
  field_component_id,
  data_id_for_anchor_linking,
  columns_width,
  content_alignment,
  background_color,
  padding,
  border,
  swap_on_mobile,
  left_section,
  right_section
}) => {
  const getBgClass = (bg) => {
    switch (bg) {
      case 'light-gray': return 'bg-light-gray';
      case 'teal': return 'bg-teal';
      case 'dark': return 'bg-dark';
      default: return 'bg-white';
    }
  };

  const getPaddingClass = (pad) => {
    switch (pad) {
      case 'none': return 'pad-none';
      case 'sm': return 'pad-sm';
      case 'md': return 'pad-md';
      case 'lg': return 'pad-lg';
      default: return 'pad-auto';
    }
  };

  const getBorderClass = (border) => {
    switch (border) {
      case 'top': return 'border-top';
      case 'bottom': return 'border-bottom';
      case 'top-bottom': return 'border-top-bottom';
      case 'all': return 'border-all';
      default: return 'border-none';
    }
  };

  const getWidthClass = (width) => {
    switch (width) {
      case '60-40': return 'width-60-40';
      case '40-60': return 'width-40-60';
      default: return 'width-equal';
    }
  };

  const getAlignClass = (align) => {
    switch (align) {
      case 'top': return 'align-top';
      case 'center': return 'align-center';
      case 'bottom': return 'align-bottom';
      default: return 'align-top';
    }
  };

  const renderSection = (section) => {
    if (!section || !Array.isArray(section)) return null;

    return section.map((item, index) => {
      switch (item._type) {
        case 'CustomImage':
          return <CustomImage key={index} {...item} />;
        case 'HTMLBlock':
          return <HTMLBlock key={index} {...item} />;
        default:
          return null;
      }
    });
  };

  const bgClass = getBgClass(background_color);
  const padClass = getPaddingClass(padding);
  const borderClass = getBorderClass(border);
  const widthClass = getWidthClass(columns_width);
  const alignClass = getAlignClass(content_alignment);
  const swapClass = swap_on_mobile ? 'swap-mobile' : '';

  return (
    <section
      className={`two-column ${bgClass} ${padClass} ${borderClass} ${widthClass} ${alignClass} ${swapClass}`}
      id={data_id_for_anchor_linking}
    >
      <div className="two-column-container">
        <div className="two-column-left">
          {renderSection(left_section)}
        </div>
        <div className="two-column-right">
          {renderSection(right_section)}
        </div>
      </div>
    </section>
  );
};

export default TwoColumn;