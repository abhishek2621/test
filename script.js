// API Configuration
const API_KEY = '8b6ee9a7d35760b1da11c57cc39d8a93'; // Replace with your actual TMDB API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const genreList = document.getElementById('genre-list');
const trendingMovies = document.getElementById('trending-movies');
const popularMovies = document.getElementById('popular-movies');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchGenres();
    fetchTrendingMovies();
    fetchPopularMovies();
    
    // Event listeners
    searchBtn.addEventListener('click', searchMovies);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMovies();
    });
});

// Fetch movie genres
async function fetchGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        
        // Display first 5 genres
        data.genres.slice(0, 5).forEach(genre => {
            const genreElement = document.createElement('a');
            genreElement.classList.add('category');
            genreElement.textContent = genre.name;
            genreElement.addEventListener('click', () => fetchMoviesByGenre(genre.id));
            genreList.appendChild(genreElement);
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

// Fetch trending movies
async function fetchTrendingMovies() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results, trendingMovies);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

// Fetch popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results, popularMovies);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Fetch movies by genre
async function fetchMoviesByGenre(genreId) {
    try {
        const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
        const data = await response.json();
        
        // Clear previous movies and display new ones
        trendingMovies.innerHTML = '';
        displayMovies(data.results, trendingMovies);
        
        // Update section title
        document.querySelector('.section-title').textContent = 'Movies in this Genre';
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
    }
}

// Search movies
async function searchMovies() {
    const query = searchInput.value.trim();
    if (query === '') return;
    
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        
        // Clear previous movies and display search results
        trendingMovies.innerHTML = '';
        displayMovies(data.results, trendingMovies);
        
        // Update section title
        document.querySelector('.section-title').textContent = `Search Results for "${query}"`;
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

// Display movies in the UI
function displayMovies(movies, container) {
    container.innerHTML = '';
    
    if (movies.length === 0) {
        container.innerHTML = '<p>No movies found</p>';
        return;
    }
    
    movies.forEach(movie => {
        if (!movie.poster_path) return; // Skip movies without posters
        
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        movieCard.innerHTML = `
            <img src="${IMG_BASE_URL}${movie.poster_path}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-meta">
                    <span>${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}</span>
                    <span>⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
            </div>
        `;
        
        // Add click event to show movie details (you can expand this)
        movieCard.addEventListener('click', () => {
            window.location.href = `movie-details.html?id=${movie.id}`;
        });
        container.appendChild(movieCard);
    });
}