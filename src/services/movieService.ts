import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MovieSearchResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

interface TMDBRequestParams {
  include_adult: boolean;
  language: string;
  page: number;
  query: string;
}

interface TMDBRequestConfig {
  params: TMDBRequestParams;
  headers: Record<string, string>;
}

export async function fetchMovies(
  query: string,
  page = 1,
): Promise<MovieSearchResponse> {
  const tmdbAccessToken = import.meta.env.VITE_TMDB_TOKEN_API_KEY;

  if (!tmdbAccessToken) {
    throw new Error('VITE_TMDB_TOKEN_API_KEY environment variable is not set');
  }

  const requestConfig: TMDBRequestConfig = {
    params: {
      include_adult: false,
      language: 'en-US',
      page,
      query,
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbAccessToken}`,
    },
  };

  const response = await axios.get<MovieSearchResponse>(
    'https://api.themoviedb.org/3/search/movie',
    requestConfig,
  );

  return response.data;
}
