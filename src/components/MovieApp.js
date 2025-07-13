import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';

const API_KEY = '15fc6247';

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovieDetails = async (imdbID) => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        i: imdbID,
        apikey: API_KEY,
        plot: 'full',
      },
    });
    return response.data;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchQuery) return;
      setLoading(true);
      try {
        const response = await axios.get('http://www.omdbapi.com/', {
          params: {
            s: searchQuery,
            apikey: API_KEY,
          },
        });

        if (response.data.Response === 'True') {
          const movieList = response.data.Search;

          const detailedMovies = await Promise.all(
            movieList.map((movie) => fetchMovieDetails(movie.imdbID))
          );
          setMovies(detailedMovies);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchQuery.trim());
  };

  const toggleDescription = (movieId) => {
    setExpandedMovieId(expandedMovieId === movieId ? null : movieId);
  };

  return (
    <div>
      <h1>GAURAV MOVIES</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <button onClick={handleSearchSubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
      ) : movies.length > 0 ? (
        <div className="movie-wrapper">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="movie">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/500'}
                alt={movie.Title}
              />
              <h2>{movie.Title} ({movie.Year})</h2>
              <p className="rating">Rating: {movie.imdbRating !== 'N/A' ? movie.imdbRating : 'N/A'}</p>
              {expandedMovieId === movie.imdbID ? (
                <p>{movie.Plot}</p>
              ) : (
                <p>{movie.Plot ? movie.Plot.substring(0, 150) + '...' : 'No description available'}</p>
              )}
              <button onClick={() => toggleDescription(movie.imdbID)} className="read-more">
                {expandedMovieId === movie.imdbID ? 'Show Less' : 'Read More'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#fff', textAlign: 'center' }}>No movies found. Try searching again.</p>
      )}
    </div>
  );
};

export default MovieRecommendations;
