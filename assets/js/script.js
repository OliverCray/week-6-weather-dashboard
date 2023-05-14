var WEATHER_API_BASE_URL = 'https://api.openweathermap.org'
var WEATHER_API_KEY = 'f23ee9deb4e1a7450f3157c44ed020e1'
var MAX_DAILY_FORECAST = 5

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
            //var city = data[0];
            var lat = data[0].lat
            var lon = data[0].lon

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

                    // Display the 5 Day Forecast
                })
        })
}


// Event handler for search button, performs onSearch when clicked
searchButton.addEventListener('click', onSearch)

