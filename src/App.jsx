import { useState, useEffect, use } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
  
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }      
      const data = await response.json();
      console.log(data);

      if(data.response === 'False') {
        setErrorMessage(data.error ||'Failed to fetch movies. Please try again later.');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);


    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
        <header>
          <img src='./hero.png' alt='Hero-Banner' />
          <h1>Find <span className='text-gradient' >Movies</span> you'll enjoy without the hastle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}  /> 
        </header>
        <section className='all-movies'>
          <h2>Popular Movies</h2>
          
          {
            isLoading ? (
              <div className='loading'>Loading...</div>
            ) : errorMessage ? (
              <div className='error'>{errorMessage}</div>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie}/>
                ))}
              </ul>
            )}
        </section>
      </div>
    </main>
  )
}

export default App
