var weatherApi = "/weather";
const weatherForm = document.querySelector("form");

const search = document.querySelector("input");

const weatherIcon = document.querySelector(".weatherIcon i");

const weatherCondition = document.querySelector(".weatherCondition");

const tempElement = document.querySelector(".temperature span");

const locationElement = document.querySelector(".place");

const dateElement = document.querySelector(".date");
const currentDate = new Date();
const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = new Date().getDate() + ", " + monthName;

weatherForm.addEventListener("submit", (e) => {
  // whenever we click submit in form this event function is called. e is event object which stores all info about submit
    e.preventDefault();
    // normally when you submit a form browser reloads page to send data
    // prevents deault of action , for forms this means preventing the browser from reloading
    // This is done so that we can handle the data using javascript instead and user entered location isn't lost
    //   console.log(search.value);
    locationElement.textContent = "Loading...";
    //before calling api I want it to show loading
    weatherIcon.className = "";
    tempElement.textContent = "";
    weatherCondition.textContent = "";
    showData(search.value);
    // search is querySelector for input in form and search.value gives entered value in form 
    // this .value doesn't work for query selectors it only works for input, textArea, select
  });

  if ("geolocation" in navigator) {
    // navigator is build in javascript object that provides information about browser
    // geolocation in navigator : This checks if the geolocation API is supported by the browser.
    // if geolocation is 
    locationElement.textContent = "Loading...";
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            console.log("Full API Response:", data);
            if (data && data.address) {

              console.log("Address Data:", data.address); // Log address part specifically
                const city =  data.address.county || 
                              data.address.city || 
                              data.address.town || 
                              data.address.village || 
                              data.address.state; 
              
              if (city) {
                console.log("Detected City:", city); // Log detected city
                showData(city);
              } else {
                console.error("City not found in location data.");
                locationElement.textContent = "Location not found.";
              }
            } else {
              console.error("Invalid location data received.");
            }
            
          })
          .catch((error) => {
            console.error("Error fetching location data:", error);
          });
      },
      function (error) {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not available in this browser.");
  }



function showData(city)
{
  getWeatherData(city, (result) =>{
    // console.log(result);
    if(result.cod == 200)
    {
      var currentWeatherCondition = result.weather[0].description;
      if(currentWeatherCondition.includes("rain"))
      {
        weatherIcon.className = "wi wi-day-" + "rain";
      }
      else if(currentWeatherCondition.includes("fog"))
      {
        weatherIcon.className = "wi wi-day-" + "fog";
      }
      else
      {
        weatherIcon.className = "wi wi-day-cloudy";
      }
      locationElement.textContent = result?.name;
      tempElement.textContent = (result?.main?.temp - 273.5).toFixed(2) + String.fromCharCode(176);
      weatherCondition.textContent = result?.weather[0]?.description?.toUpperCase();
      // By default .temp shows result in fahrenheit, to get in .Celcius we minus it by 273.5
      // toFixed(2) makes sure that there are at max only 2 values after decimal
      // String.fromCharCode(175) gives us that dot degree celcius symbol
    }
    else
    {
      locationElement.textContent = "City not found.";
    }
  });
}

function getWeatherData(city, callback) {
  const locationApi = weatherApi + "?address=" + city;
  fetch(locationApi).then((response) => {
    response.json().then((response) => {
      callback(response);
    });
  });
}

// fetch(locationApi)
// Makes a request to "/weather?address=" + city".
// If city = "Mumbai", it calls: /weather?address=Mumbai
// This is handled by your Express backend in app.js, which gets the actual weather data.
// .then(response => response.json())

// Takes the response and converts it into JSON format.
// .then(response => callback(response))
// Passes the response to the callback function (which logs or updates UI).
