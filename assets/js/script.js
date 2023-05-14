var WEATHER_API_BASE_URL = 'https://api.openweathermap.org'
var WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1'

var searchInput = document.querySelector('#city')
var searchButton = document.querySelector('#searchBtn')

// create an array of searched cities

function onSearch() {

    // Assign to city entered by the user to the variable userSearch
    var userSearch = searchInput.value

    // Display an error message if there's no input, otherwise search for that city's weather data
    if (userSearch === '') {
        displayErrorMessage('Please enter a city name')
    } else {
        lookupCity(userSearch)
    }
}

// Sets the text content of the error message back to blank
function clearErrorMessage() {
    var errorMessage = document.querySelector('#error-message')
    errorMessage.textContent = ''
}

// Used to display an error message when there is no text input
function displayErrorMessage(text) {
    var errorMessage = document.querySelector('#error-message')
    errorMessage.textContent = text

    // Clears the error message after 2 seconds
    setTimeout(clearErrorMessage, 2000)
}

function lookupCity(search) {

    // Lookup the city to get the Lat/Lon
    var apiUrl = `${WEATHER_API_BASE_URL}/geo/1.0/direct?q=${search}&limit=5&appid=${WEATHER_API_KEY}`
    fetch(apiUrl)
        .then(function(response) {
            return response.json()
        })
        .then(function(data)  {

            console.log(data)

            // Pick the First city from the results
            var lat = data[0].lat
            var lon = data[0].lon

            var selectedData = {
                name: data[0].name,
                state: data[0].state,
                country: data[0].country,
                lat: data[0].lat,
                lon: data[0].lon
            }

            // Get the Weather for the cached city
            var apiUrl = `${WEATHER_API_BASE_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${WEATHER_API_KEY}`
            console.log(apiUrl)
            fetch(apiUrl)
                .then(function(response) {
                    return response.json()
                })
                .then(function(data) {

                    console.log(data)

                    // Display the Current Weather
                    displayCurrentWeather(data)

                    // Display the 5 Day Forecast
                    displayForecast(data)
                })
                
                // Displays city
                displayCity(selectedData)
        })
}

// Converts temperature from fahrenheit to celsius
function convertTemperature(valF) {
    var valF = parseFloat(valF)
    var valC = (valF-32)/1.8
    // Limits output to 2 decimal places
    return valC.toFixed(2)
}

// Gets current weather data from api to be displayed at the top of the page 
function displayCurrentWeather(weatherData) {
    // Sets text content for temperature, wind speed and humidity
    document.querySelector('#val_temperature').textContent = `${weatherData.current.temp}°F | ${convertTemperature(weatherData.current.temp)}°C`
    document.querySelector('#val_wind-speed').textContent = `${weatherData.current.wind_speed} mph`
    document.querySelector('#val_humidity').textContent = `${weatherData.current.humidity}%`
}

// Gets weather forecast data from api to be displayed under 5-Day Forecast
function displayForecast(weatherData) {
    // Clear previous forecast
    var forcecastSection = document.querySelector('#days')
    forcecastSection.innerHTML = ''

    // Generate html for the forecast
    for (var i = 0; i < 5; i++) {
        var forecast = weatherData.daily[i]
        var options = {weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric'}
        var day = new Date(forecast.dt * 1000).toLocaleDateString('en-GB', options)
        var temperature = `${forecast.temp.day}°F | ${convertTemperature(forecast.temp.day)}°C`
        var windSpeed = `${forecast.wind_speed} mph`
        var humidity = `${forecast.humidity} mph`

        var cityForecast = document.createElement('div')
        cityForecast.classList.add('day')
        cityForecast.innerHTML = `<div class="weather-forecast">
            <div class="date">
                <span>${day}</span>
            </div>
            <div class="temperature">
                <span>${temperature}</span>
            </div>
            <div class="wind-speed">
                <span>${windSpeed}</span>
            </div>
            <div class="humidity">
                <span>${humidity}</span>
            </div>
        </div>`

        // Append forecast so that it can be displayed
        forcecastSection.appendChild(cityForecast)
    }
}

// Displays City name, state, country and date at the top of the page
function displayCity(weatherData) {
    var cityName = document.querySelector('#city-name')
    var options = {weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric'}
    var day = new Date().toLocaleDateString('en-GB', options)

    cityName.innerHTML = `${weatherData.name}, ${weatherData.state}, ${weatherData.country}<br>${day}`
}

// Event handler for search button, performs onSearch when clicked
searchButton.addEventListener('click', onSearch)

