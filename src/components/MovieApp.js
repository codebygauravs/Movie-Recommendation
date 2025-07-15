 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  const API_KEY = '644f849f9f1aaacb1f4f293e1dd378d5';

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: { api_key: API_KEY },
        });
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch movies by sort and genre (not search)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
          params: {
            api_key: API_KEY,
            sort_by: sortBy,
            page: 1,
            with_genres: selectedGenre,
          },
        });
        setMovies(response.data.results);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      }
    };
    fetchMovies();
  }, [sortBy, selectedGenre]); // ✅ Removed searchQuery here

  // Search movies manually
  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: API_KEY,
          query: searchQuery,
        },
      });
      setMovies(response.data.results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
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

      <div className="filters">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>

        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="movie-wrapper">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={movie.title}
              />
              <h2>{movie.title}</h2>
              <p className="rating">Rating: {movie.vote_average}</p>
              <p>
                {expandedMovieId === movie.id
                  ? movie.overview
                  : `${movie.overview?.substring(0, 150)}...`}
              </p>
              <button onClick={() => toggleDescription(movie.id)} className="read-more">
                {expandedMovieId === movie.id ? 'Show Less' : 'Read More'}
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
