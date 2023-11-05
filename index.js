"use strict";

const baseSearchUrl =
  "https://www.omdbapi.com/?apikey=576559f2&type=movie&page=1&s=";

const main = document.querySelector("main");

const baseMovieUrl = "https://www.omdbapi.com/?apikey=576559f2&type=movie&t=";

async function showmovie(title) {
  const url = baseMovieUrl + title;
  try {
    const response = await fetch(url);
    console.log(response);
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("movie", JSON.stringify(data));
      window.location.href = "./movie.html";
      return;
    } else {
      alert("Failed to fetch data.");
      console.error("Failed to fetch data. Status:", response.status);
    }
  } catch {
    alert("An error occured");
  }
}

// Function to add a movie to favorites
function addToFavorites(event) {
  const key = event.target.getAttribute("key");
  let movies = JSON.parse(localStorage.getItem("movies")) || [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let movieToAdd = movies[key];

  const isAlreadyInFavorites = favorites.some((favorite) => JSON.stringify(favorite) === JSON.stringify(movieToAdd));

  if (!isAlreadyInFavorites) {
    favorites.push(movieToAdd);
    alert("Movie added to favorites");
    localStorage.setItem("favorites", JSON.stringify(favorites)); 
  } else {
    alert("Movie is already in favorites");
  }
}


// Function to search for movies
async function searchMovies(event) {
  if (event.key === "Enter") {
    const movie = event.target.value;
    const url = baseSearchUrl + movie;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("movies", JSON.stringify(data.Search)); 
        window.location.href = "./index.html";
        list(data.Search);
      } else {
        console.error("Failed to fetch data. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}

// Function to list movies
function list(movies) {
  if (!movies || movies.length === 0) {
    main.innerHTML = "<p class='nomovies'> No movies found.</p>";
    return;
  }

  const listItems = movies.map((movie, i) => {
    const image = `<img src="${movie.Poster}" alt="poster" class="poster" onclick="showmovie('${movie.Title}')" >`;
    return `
      <li key=${i} class="movie_items">
          <aside class="movie_info">
          <button onclick="showmovie('${movie.Title}')"><h1>Name : ${
      movie.Title
    }</h1></button>
          <div class="movieDetails">         
          <h2>Year : ${movie.Year}</h2>
              <h2>Id : ${movie.imdbID}</h2>
              <h2>Type :${movie.Type}</h2>
            </div>
          </aside>
          <div class="movieImage"> 
            <img src="./assets/heart-pink1.png" onclick="addToFavorites(event)" key=${i} class="favourite">
            ${
              movie.Poster != "N/A"
                ? image
                : '<p class="poster">Movie poster not available</p>'
            }
          </div>
        </li>`;
  });
  // Use join to convert the array to a string
  main.innerHTML = `<ol start="1" class="movielist">${listItems.join("")}</ol>`;
}
// Handle cases where there are no movies
const movies = JSON.parse(localStorage.getItem("movies")) || [];
console.log(movies);
list(movies);
