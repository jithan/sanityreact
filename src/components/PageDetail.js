import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { useLiveQuery } from "@sanity/preview-kit";

import { client } from "../sanityClient";

import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import SplitImageSection from "./SplitImageSection";
import TextSection from "./TextSection";
import CTACardPanel from "./CTACardPanel";
import ContactCallout from "./ContactCallout";

import "../styles/PageDetail.css";

const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  content,
  seo{
    metaTitle,
    metaDescription,
    ogImage{
      asset->{url}
    }
  }
}`;

function PageDetail() {

  let { slug } = useParams();
  const navigate = useNavigate();

  if (!slug) slug = "home";

  const [initialData, setInitialData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // initial fetch
useEffect(() => {

  const interval = setInterval(() => {

    client.fetch(pageQuery, { slug }).then((data) => {
      if (data) {
       setInitialData(data);
setLoadingInitial(false);
      }
    });

  }, 5000);

  return () => clearInterval(interval);

}, [slug]);

  // live query
  const [page, loadingLive] = useLiveQuery(
    initialData,
    pageQuery,
    { slug }
  );

  const loading = loadingInitial || loadingLive;

  const applySeo = (data) => {

    if (data?.seo?.metaTitle) {
      document.title = data.seo.metaTitle;
    } else if (data?.title) {
      document.title = data.title;
    }

    if (data?.seo?.metaDescription) {

      let meta = document.querySelector('meta[name="description"]');

      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", data.seo.metaDescription);
    }

  };

  useEffect(() => {
    if (page) applySeo(page);
  }, [page]);

  const portableTextComponents = {

    block: {
      normal: ({ children }) => <p>{children}</p>,
      h1: ({ children }) => <h1>{children}</h1>,
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
    },

    types: {
      hero: ({ value }) => <HeroSection {...value} />,
      features: ({ value }) => <FeaturesSection {...value} />,
      splitImage: ({ value }) => <SplitImageSection {...value} />,
      textSection: ({ value }) => <TextSection {...value} />,
      ctaCardPanel: ({ value }) => <CTACardPanel {...value} />,
      contactCallout: ({ value }) => <ContactCallout {...value} />,
    }

  };

  if (loading) {
    return <div className="loading">Loading page...</div>;
  }

  if (!page) {
    return (
      <div className="error">
        <p>Page not found</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="page-detail-container">
      <article className="page-detail">

        <header className="page-header">
          <h1>{page.title}</h1>
        </header>

        <div className="page-content">

          <PortableText
            value={page.content}
            components={portableTextComponents}
          />

        </div>

      </article>
    </div>
  );

}

export default PageDetail;