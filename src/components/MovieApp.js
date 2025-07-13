 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import './MovieApp.css';

const TMDB_API_KEY = '644f849f9f1aaacb1f4f293e1dd378d5';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('');

  const sortMovies = (movies, option) => {
    const sorted = [...movies];
    switch (option) {
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'year-desc':
        return sorted.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
      case 'year-asc':
        return sorted.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
      case 'rating-desc':
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case 'rating-asc':
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      default:
        return movies;
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchQuery) return;
      setLoading(true);
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
          params: {
            api_key: TMDB_API_KEY,
            query: searchQuery,
          },
        });

        const results = response.data.results || [];
        setMovies(sortMovies(results, sortOption));
      } catch (error) {
        console.error('Error fetching movies from TMDB:', error);
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
