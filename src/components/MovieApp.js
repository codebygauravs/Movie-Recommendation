import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';

const API_KEY = '15fc6247';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const BASE_URL = `${CORS_PROXY}http://www.omdbapi.com/`;

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState(''); // New

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          i: imdbID,
          apikey: API_KEY,
          plot: 'full',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return {};
    }
  };

  const sortMovies = (movies, option) => {
    const sorted = [...movies];
    switch (option) {
      case 'title-asc':
        return sorted.sort((a, b) => a.Title.localeCompare(b.Title));
      case 'title-desc':
        return sorted.sort((a, b) => b.Title.localeCompare(a.Title));
      case 'year-desc':
        return sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
      case 'year-asc':
        return sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
      case 'rating-desc':
        return sorted.sort((a, b) => parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0));
      case 'rating-asc':
        return sorted.sort((a, b) => parseFloat(a.imdbRating || 0) - parseFloat(b.imdbRating || 0));
      default:
        return movies;
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchQuery) return;
      setLoading(true);
      try {
        const response = await axios.get(BASE_URL, {
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
          setMovies(sortMovies(detailedMovies, sortOption));
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
  }, [searchQuery, sortOption]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchQuery.trim());
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
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

      {/* Sort Options */}
      <div className="sort-bar">
        <label htmlFor="sort" style={{ color: '#fff' }}>Sort By:</label>
        <select id="sort" value={sortOption} onChange={handleSortChange} className="sort-select">
          <option value="">-- Select --</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="year-desc">Newest First</option>
          <option value="year-asc">Oldest First</option>
          <option value="rating-desc">Rating High to Low</option>
          <option value="rating-asc">Rating Low to High</option>
        </select>
      </div>

      {loading ? (
        <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
      ) : movies.length > 0 ? (
        <div className="movie-wrapper">
          {sortMovies(movies, sortOption).map((movie) => (
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
