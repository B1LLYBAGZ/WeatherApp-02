// Add an event listener to the search button
document
  .getElementById("search-button")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const city = document.getElementById("search-input").value; // Get the value from the search input field
    if (city) {
      // If the input is not empty
      saveSearch(city); // Save the search term
      fetchCoordinates(city); // Fetch the coordinates for the city
    }
  });

// Function to save the search term in local storage
function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem("weatherSearches")) || []; // Get existing searches or initialize an empty array
  if (!searches.includes(city)) {
    // If the search term is not already saved
    searches.push(city); // Add the new search term to the array
    localStorage.setItem("weatherSearches", JSON.stringify(searches)); // Save the updated array to local storage
    displaySearchHistory(); // Update the search history display
  }
}

// Function to display search history
function displaySearchHistory() {
  const historyContainer = document.getElementById("history"); // Get the history container element
  historyContainer.innerHTML = ""; // Clear the current history display
  let searches = JSON.parse(localStorage.getItem("weatherSearches")) || []; // Get existing searches or initialize an empty array
  searches.forEach((city) => {
    // For each search term
    const searchItem = document.createElement("button"); // Create a new button element
    searchItem.classList.add(
      "list-group-item",
      "list-group-item-action",
      "search-button"
    ); // Add classes to the button
    searchItem.textContent = city; // Set the button text to the search term
    searchItem.addEventListener("click", function () {
      // Add click event listener to the button
      fetchCoordinates(city); // Fetch coordinates for the clicked search term
    });
    historyContainer.appendChild(searchItem); // Add the button to the history container
  });
}

// Function to fetch coordinates for a city using OpenWeatherMap API
function fetchCoordinates(city) {
  const apiKey = "aa4146c1bc0c616b862a41b2c807ef06"; // API key for OpenWeatherMap
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`; // URL for the geocoding API

  fetch(url)
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
      if (data.length === 0) {
        // If no data is returned
        alert("City not found"); // Alert the user
        return;
      }
      const lat = data[0].lat; // Get latitude from the response
      const lon = data[0].lon; // Get longitude from the response
      fetchWeather(lat, lon, data[0].name); // Fetch weather data using the coordinates
    })
    .catch((error) => console.error("Error fetching coordinates:", error)); // Log any errors
}

// Function to fetch weather data using coordinates and OpenWeatherMap API
function fetchWeather(lat, lon, cityName) {
  const apiKey = "aa4146c1bc0c616b862a41b2c807ef06"; // API key for OpenWeatherMap
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; // URL for the weather API

  fetch(url)
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => displayWeather(data, cityName)) // Display the weather data
    .catch((error) => console.error("Error fetching weather data:", error)); // Log any errors
}

// Function to display weather data
function displayWeather(data, cityName) {
  const todaySection = document.getElementById("today"); // Get the today section element
  const forecastSection = document.getElementById("forecast"); // Get the forecast section element
  todaySection.innerHTML = ""; // Clear the current today section content
  forecastSection.innerHTML = ""; // Clear the current forecast section content

  // Display city and current weather
  const currentWeather = data.list[0]; // Get current weather data
  const iconUrl = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`; // Get the weather icon URL
  const tempF = (currentWeather.main.temp * 9) / 5 + 32; // Convert temperature to Fahrenheit
  const todayDiv = document.createElement("div"); // Create a new div for today's weather
  todayDiv.classList.add("weather-day"); // Add class to the div
  todayDiv.innerHTML = `
        <h2>Weather in ${cityName}</h2>
        <h3>${new Date(currentWeather.dt * 1000).toLocaleDateString()}</h3>
        <img class="weather-icon" src="${iconUrl}" alt="${
    currentWeather.weather[0].description
  }">
        <p>Temp: ${tempF.toFixed(1)} °F</p>
        <p>Weather: ${currentWeather.weather[0].description}</p>
        <p>Humidity: ${currentWeather.main.humidity}%</p>
        <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
    `; // Set the inner HTML of the div with weather information
  todaySection.appendChild(todayDiv); // Add the div to the today section

  // Display 5-day forecast
  const forecast = data.list.slice(0, 5); // Get first 5 entries for simplicity
  forecast.forEach((day) => {
    const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`; // Get the weather icon URL
    const tempF = (day.main.temp * 9) / 5 + 32; // Convert temperature to Fahrenheit
    const dayDiv = document.createElement("div"); // Create a new div for the forecast
    dayDiv.classList.add("weather-day", "col"); // Add classes to the div
    dayDiv.innerHTML = `
            <h3>${new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <img class="weather-icon" src="${iconUrl}" alt="${
      day.weather[0].description
    }">
            <p>Temp: ${tempF.toFixed(1)} °F</p>
            <p>Weather: ${day.weather[0].description}</p>
            <p>Humidity: ${day.main.humidity}%</p>
            <p>Wind Speed: ${day.wind.speed} m/s</p>
        `; // Set the inner HTML of the div with weather information
    forecastSection.appendChild(dayDiv); // Add the div to the forecast section
  });
}

// Display search history on page load
document.addEventListener("DOMContentLoaded", displaySearchHistory); // Call displaySearchHistory function when the page loads
