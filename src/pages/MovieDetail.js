import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from '../sanityClient';
import { PortableText } from '@portabletext/react';
import KalturaVideoPlayer from '../components/KalturaVideoPlayer';
import './MovieDetail.css';

function MovieDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "movie" && (slug.current == $slug || _id == $slug)][0] {
            _id,
            title,
            slug,
            releaseDate,
            overview,
            runtime,
            budget,
            boxOffice,
            poster {
              asset -> {
                url,
                metadata {
                  dimensions {
                    height,
                    width
                  }
                }
              },
              alt,
              hotspot
            },
            backdrop {
              asset -> {
                url
              },
              alt
            },
            director -> {
              name,
              image {
                asset -> {
                  url
                }
              },
              bio
            },
            cast[] -> {
              name,
              image {
                asset -> {
                  url
                }
              },
              character
            },
            genres,
            rating,
            trailerUrl,
            kalturaVideo,
            productionCompanies,
            countries,
            languages
          }
        `, { slug });

        if (!data) {
          setError('Movie not found');
          setLoading(false);
          return;
        }

        setMovie(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  const portableTextComponents = {
    block: {
      normal: ({ children }) => <p>{children}</p>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
    },
  };

  if (loading) {
    return <div className="loading">Loading movie...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error">
        <p>Movie not found</p>
        <button onClick={() => navigate('/movies')}>Back to Movies</button>
      </div>
    );
  }

  return (
    <div className="movie-detail-container">
      <button className="back-button" onClick={() => navigate('/movies')}>
        ← Back to Movies
      </button>

      <article className="movie-detail">
        {movie.backdrop && (
          <div className="movie-backdrop">
            <img
              src={movie.backdrop.asset.url}
              alt={movie.backdrop.alt || movie.title}
            />
            <div className="backdrop-overlay"></div>
          </div>
        )}

        <header className="movie-header">
          <div className="movie-header-content">
            {movie.poster && (
              <div className="movie-poster-large">
                <img
                  src={movie.poster.asset.url}
                  alt={movie.poster.alt || movie.title}
                />
              </div>
            )}

            <div className="movie-info">
              <h1>{movie.title}</h1>

              <div className="movie-meta">
                {movie.releaseDate && (
                  <span className="release-year">
                    {new Date(movie.releaseDate).getFullYear()}
                  </span>
                )}
                {movie.runtime && (
                  <span className="runtime">{movie.runtime} min</span>
                )}
                {movie.rating && (
                  <span className="rating">⭐ {movie.rating}/10</span>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="genres">
                  {(movie.genres || []).map((genre, idx) => (
                    <span key={idx} className="genre">
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {movie.director && (
                <div className="director-info">
                  <h3>Director</h3>
                  <div className="director-details">
                    {movie.director.image && (
                      <img
                        src={movie.director.image.asset.url}
                        alt={movie.director.name}
                        className="director-image"
                      />
                    )}
                    <div>
                      <span className="director-name">{movie.director.name}</span>
                      {movie.director.bio && (
                        <p className="director-bio">{movie.director.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="movie-body">
          {movie.overview && (
            <section className="overview-section">
              <h2>Overview</h2>
              <div className="overview-content">
                <PortableText
                  value={movie.overview}
                  components={portableTextComponents}
                />
              </div>
            </section>
          )}

          {movie.kalturaVideo && (
            <section className="trailer-section">
              <h2>{movie.kalturaVideo.title || 'Trailer'}</h2>
              <KalturaVideoPlayer
                kalturaId={movie.kalturaVideo.videoId}
                partnerId={movie.kalturaVideo.partnerId}
                playerSize={{
                  width: movie.kalturaVideo.width ? `${movie.kalturaVideo.width}px` : '100%',
                  height: movie.kalturaVideo.height ? `${movie.kalturaVideo.height}px` : '500px'
                }}
              />
              {movie.kalturaVideo.caption && (
                <p className="video-caption">{movie.kalturaVideo.caption}</p>
              )}
            </section>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <section className="cast-section">
              <h2>Cast</h2>
              <div className="cast-grid">
                {(movie.cast || []).map((actor, idx) => (
                  <div key={idx} className="cast-member">
                    {actor.image && (
                      <img
                        src={actor.image.asset.url}
                        alt={actor.name}
                        className="cast-image"
                      />
                    )}
                    <div className="cast-info">
                      <span className="cast-name">{actor.name}</span>
                      {actor.character && (
                        <span className="character">as {actor.character}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="movie-details-grid">
            {movie.budget && (
              <div className="detail-item">
                <h3>Budget</h3>
                <p>${movie.budget.toLocaleString()}</p>
              </div>
            )}

            {movie.boxOffice && (
              <div className="detail-item">
                <h3>Box Office</h3>
                <p>${movie.boxOffice.toLocaleString()}</p>
              </div>
            )}

            {movie.productionCompanies && movie.productionCompanies.length > 0 && (
              <div className="detail-item">
                <h3>Production</h3>
                <p>{movie.productionCompanies.join(', ')}</p>
              </div>
            )}

            {movie.countries && movie.countries.length > 0 && (
              <div className="detail-item">
                <h3>Countries</h3>
                <p>{movie.countries.join(', ')}</p>
              </div>
            )}

            {movie.languages && movie.languages.length > 0 && (
              <div className="detail-item">
                <h3>Languages</h3>
                <p>{movie.languages.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export default MovieDetail;