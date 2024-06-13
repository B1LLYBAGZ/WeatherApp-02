document
  .getElementById("search-button")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const city = document.getElementById("search-input").value;
    if (city) {
      saveSearch(city);
      fetchCoordinates(city);
    }
  });

function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem("weatherSearches")) || [];
  if (!searches.includes(city)) {
    searches.push(city);
    localStorage.setItem("weatherSearches", JSON.stringify(searches));
    displaySearchHistory();
  }
}

function displaySearchHistory() {
  const historyContainer = document.getElementById("history");
  historyContainer.innerHTML = "";
  let searches = JSON.parse(localStorage.getItem("weatherSearches")) || [];
  searches.forEach((city) => {
    const searchItem = document.createElement("button");
    searchItem.classList.add(
      "list-group-item",
      "list-group-item-action",
      "search-button"
    );
    searchItem.textContent = city;
    searchItem.addEventListener("click", function () {
      fetchCoordinates(city);
    });
    historyContainer.appendChild(searchItem);
  });
}

function fetchCoordinates(city) {
  const apiKey = "aa4146c1bc0c616b862a41b2c807ef06";
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        alert("City not found");
        return;
      }
      const lat = data[0].lat;
      const lon = data[0].lon;
      fetchWeather(lat, lon, data[0].name);
    })
    .catch((error) => console.error("Error fetching coordinates:", error));
}

function fetchWeather(lat, lon, cityName) {
  const apiKey = "aa4146c1bc0c616b862a41b2c807ef06";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => displayWeather(data, cityName))
    .catch((error) => console.error("Error fetching weather data:", error));
}

function displayWeather(data, cityName) {
  const todaySection = document.getElementById("today");
  const forecastSection = document.getElementById("forecast");
  todaySection.innerHTML = "";
  forecastSection.innerHTML = "";

  // Display city and current weather
  const currentWeather = data.list[0];
  const iconUrl = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;
  const todayDiv = document.createElement("div");
  todayDiv.classList.add("weather-day");
  todayDiv.innerHTML = `
        <h2>Weather in ${cityName}</h2>
        <h3>${new Date(currentWeather.dt * 1000).toLocaleDateString()}</h3>
        <img class="weather-icon" src="${iconUrl}" alt="${
    currentWeather.weather[0].description
  }">
        <p>Temp: ${currentWeather.main.temp} °C</p>
        <p>Weather: ${currentWeather.weather[0].description}</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `;
  todaySection.appendChild(todayDiv);

  // Display 5-day forecast
  const forecast = data.list.slice(0, 5); // Get first 5 entries for simplicity
  forecast.forEach((day) => {
    const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("weather-day", "col");
    dayDiv.innerHTML = `
            <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <img class="weather-icon" src="${iconUrl}" alt="${
      day.weather[0].description
    }">
            <p>Temp: ${day.main.temp} °C</p>
            <p>Weather: ${day.weather[0].description}</p>
            <p>Humidity: ${day.main.humidity}%</p>
            <p>Wind Speed: ${day.wind.speed} m/s</p>
        `;
    forecastSection.appendChild(dayDiv);
  });
}

// Display search history on page load
document.addEventListener("DOMContentLoaded", displaySearchHistory);
