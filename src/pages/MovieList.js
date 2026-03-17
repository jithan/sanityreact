import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanityClient';
import { PortableText } from '@portabletext/react';
import './MovieList.css';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "movie"] | order(releaseDate desc) {
            _id,
            title,
            slug,
            releaseDate,
            overview,
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
            director -> {
              name,
              image {
                asset -> {
                  url
                }
              }
            },
            genres,
            rating
          }
        `);
        setMovies(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (error) {
    return <div className="error">Error loading movies: {error}</div>;
  }

  if (movies.length === 0) {
    return <div className="no-movies">No movies found.</div>;
  }

  return (
    <div className="movies-container">
      <h1>Movies</h1>
      <div className="movies-grid">
        {movies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movies/${movie.slug?.current || movie._id}`}
            className="movie-card-link"
          >
            <div className="movie-card">
              {movie.poster && (
                <div className="movie-poster">
                  <img
                    src={movie.poster.asset.url}
                    alt={movie.poster.alt || movie.title}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="movie-content">
                <h2>{movie.title}</h2>
                <div className="movie-meta">
                  {movie.releaseDate && (
                    <span className="release-date">
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  )}
                  {movie.rating && (
                    <span className="rating">⭐ {movie.rating}/10</span>
                  )}
                </div>
                {movie.overview && (
                  <div className="overview">
                    <PortableText value={movie.overview} />
                  </div>
                )}
                {movie.director && (
                  <span className="director">Directed by {movie.director.name}</span>
                )}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="genres">
                    {(movie.genres || []).slice(0, 3).map((genre, idx) => (
                      <span key={idx} className="genre">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MovieList;