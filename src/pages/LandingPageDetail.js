import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { client } from "../sanityClient";

import HeroImage from "../components/HeroImage";
import AnchorLinks from "../components/AnchorLinks";
import FullwidthImage from "../components/FullwidthImage";
import SpotlightContentService from "../components/SpotlightContentService";
import TwoColumn from "../components/TwoColumn";

import "./PageDetail.css";

const landingPageQuery = `*[_type == "Landingpage" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  components[]{
    ...,
    field_link{
      label,
      url,
      openInNewTab
    },
    image_field{
      asset->{url},
      alt
    },
    logo_service_pillar_sm{
      asset->{url},
      alt
    },
    image_full_width{
      asset->{url},
      alt
    },
    image{
      asset->{url},
      alt
    },
    logo_or_service_pillar{
      asset->{url},
      alt
    },
    link{
      label,
      url,
      openInNewTab
    },
    left_section[]{
      ...,
      image{
        asset->{url},
        alt
      }
    },
    right_section[]{
      ...,
      image{
        asset->{url},
        alt
      }
    }
  }
}`;
function LandingPageDetail() {

  let { slug } = useParams();
  const navigate = useNavigate();

  if (!slug) slug = "home";

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    client.fetch(landingPageQuery, { slug }).then((data) => {
      setPage(data);
      setLoading(false);
    });

  }, [slug]);

  if (loading) {
    return <div className="loading">Loading page...</div>;
  }

  if (!page) {
    return (
      <div className="error">
        <p>Landing page not found</p>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const renderComponent = (component, index) => {

    switch (component._type) {

      case "Heroimage":
        return <HeroImage key={index} {...component} />;

      case "Anchor_links":
        return <AnchorLinks key={index} {...component} />;

      case "FullwidthImage":
        return <FullwidthImage key={index} {...component} />;

      case "SpotlightContentService":
        return <SpotlightContentService key={index} {...component} />;

      case "TwoColumn":
        return <TwoColumn key={index} {...component} />;

      default:
        return null;

    }

  };

  return (
    <div className="page-detail-container landingpage">

      <article className="page-detail">

        {/* <header className="page-header">
          <h1>{page.title}</h1>
          {page.excerpt && <p className="page-excerpt">{page.excerpt}</p>}
        </header> */}

        <div className="page-content">

          {page.components?.map((component, index) =>
            renderComponent(component, index)
          )}

        </div>

      </article>

    </div>
  );

}

export default LandingPageDetail;