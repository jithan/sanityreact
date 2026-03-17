import React from "react";
import { PortableText } from "@portabletext/react";
import "../styles/HTMLBlock.css";

const HTMLBlock = ({
  field_component_id,
  data_id_for_anchor_linking,
  title,
  text_format,
  description_rich,
  description_html
}) => {
  return (
    <section
      className="html-block"
      id={data_id_for_anchor_linking}
    >
      {title && <h2 className="html-block-title">{title}</h2>}

      <div className="html-block-content">
        {text_format === 'richText' && description_rich ? (
          <PortableText value={description_rich} />
        ) : text_format === 'rawHtml' && description_html ? (
          <div dangerouslySetInnerHTML={{ __html: description_html }} />
        ) : null}
      </div>
    </section>
  );
};

export default HTMLBlock;