"use strict";

const baseSearchUrl =
  "https://www.omdbapi.com/?apikey=576559f2&type=movie&page=1&s=";

const main = document.querySelector("main");

const baseMovieUrl = "https://www.omdbapi.com/?apikey=576559f2&type=movie&t=";
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

function list(movies) {
  if (!movies || movies.length === 0) {
    main.innerHTML = "<p class='nomovies'> No movies found.</p>";
    return;
  }

  const listItems = movies.map((movie, i) => {
    const image = `<img src="${movie.Poster}" alt="poster" class="poster" onclick="showmovie('${movie.Title}')" >`
    return `
      <li key=${i} class="movie_items">
      <aside class="movie_info">
      <button onclick="showmovie('${movie.Title}')"><h1>Name : ${
  movie.Title
}</h1></button>
      <div class="movieDetails">         <h2>Year : ${movie.Year}</h2>
          <h2>Id : ${movie.imdbID}</h2>
          <h2>Type :${movie.Type}</h2>
        </div>
      </aside>
          <div class="movieImage"> 
            <img src="./assets/heart-empty1.png" onclick="removeFavourites('${i}')" key=${i} class="favourite">
            ${
              movie.Poster != "N/A"
                ? image
                : '<p class="poster">Movie poster not available</p>'
            }
          </div>
        </li>`;
  });
  // Use join to convert the array to a string
  main.innerHTML = `<ul class="movielist">${listItems.join("")}</ul>`;
}
async function showmovie(title) {
  const url = baseMovieUrl + title;
  try {
    const response = await fetch(url);
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
const movie = JSON.parse(localStorage.getItem("favorites")) || [];
list(movie);

function removeFavourites(key){
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((item,i) => i!=key);
  localStorage.setItem("favorites", JSON.stringify(favorites)); 
  list(favorites);
}