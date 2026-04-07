import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import styles from './App.module.css';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    console.log('[App] Searching:', query);
    setMovies([]);
    setIsError(false);
    setIsLoading(true);

    try {
      const results = await fetchMovies(query);
      console.log('[App] fetchMovies results:', results);

      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies(results);
    } catch (error) {
      console.error('[App] fetchMovies error:', error);
      setIsError(true);
      toast.error('Something went wrong while loading movies.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />
      <main className={styles.main}>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleSelect} />
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}