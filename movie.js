("use strict");
const baseSearchUrl =
  "https://www.omdbapi.com/?apikey=576559f2&type=movie&page=1&s=";

const main = document.querySelector("main");
const baseMovieUrl = "https://www.omdbapi.com/?apikey=576559f2&type=movie&t=";

function addToFavorites(movie) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let movieToAdd = movie;
  const isAlreadyInFavorites = favorites.some((favorite) => JSON.stringify(favorite) === JSON.stringify(movieToAdd));

  if (!isAlreadyInFavorites) {
    favorites.push(movieToAdd);
    alert("Movie added to favorites");
    localStorage.setItem("favorites", JSON.stringify(favorites)); 
  } else {
    alert("Movie is already in favorites");
  }
}



function view(movie) {
  if (movie == "") {
    main.innerHTML = "<h1>Movie not found </h1>";
    return;
  }
  const html = `<div class="moviePageCard">
    <img src=${movie.Poster} alt=${movie.Title} class="moviePagePoster">
    <div class="cardItems"> 
      <div class="items"> <h2>Title : </h2> <p>${movie.Title}</p> </div>
      <div class="items"> <h2>Year : </h2> <p>${movie.Year}</p> </div>
      <div class="items"> <h2>Ratings : </h2> <p>${movie.imdbRating}</p> </div>
      <div class="items"> <h2>Writer : </h2> <p>${movie.Writer}</p> </div>
      <div class="items"> <h2>Genre : </h2> <p>${movie.Genre}</p> </div>
      <div class="items"> <h2>Actors : </h2> <p>${movie.Actors}</p> </div>
      <img src="./assets/heart-pink1.png" onclick="addToFavorites('${movie}')" class="fave">
    </div>
  </div>
  <aside class="moviePlot">
    <h1>Summary : </h1>
    <p>${movie.Plot}</p>
  </aside>`;
  console.log(movie.Plot)
  main.innerHTML = html;
}

const info = JSON.parse(localStorage.getItem("movie")) || "";
view(info);

async function searchMovies(event) {
  if (event.key === "Enter") {
    const movie = event.target.value;
    const url = baseSearchUrl + movie;
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("movies", JSON.stringify(data.Search));
        window.location.href = "./index.html";
      } else {
        console.error("Failed to fetch data. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
}