 import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  const API_KEY = '15fc6247'; // OMDb API key

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get('https://www.omdbapi.com/', {
        params: {
          apikey: API_KEY,
          s: searchQuery,
        },
      });

      if (response.data.Response === 'True') {
        setMovies(response.data.Search);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setMovies([]);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
          onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          className="search-input"
        />
        <button onClick={handleSearchSubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>

      <div className="movie-wrapper">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdbID} className="movie">
              <img
                src={
                  movie.Poster !== 'N/A'
                    ? movie.Poster
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.Title}
              />
              <h2>{movie.Title}</h2>
              <p className="rating">Year: {movie.Year}</p>
              {expandedMovieId === movie.imdbID ? (
                <p>IMDb ID: {movie.imdbID}</p>
              ) : (
                <p>Type: {movie.Type}</p>
              )}
              <button onClick={() => toggleDescription(movie.imdbID)} className="read-more">
                {expandedMovieId === movie.imdbID ? 'Show Less' : 'Read More'}
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieRecommendations;
