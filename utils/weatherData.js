require("dotenv").config();
// this ensures that your .env file is read correctly
const request = require("request");


const openWeatherMap = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
  SECRET_KEY: process.env.OPENWEATHER_API_KEY,
};
console.log('The secret key is as follows : ${openWeatherMap.SECRET_KEY}');
const weatherData = (address, callback) => {
  const url = openWeatherMap.BASE_URL + encodeURIComponent(address) + "&APPID=" + openWeatherMap.SECRET_KEY;
  console.log(url);
  request({ url, json: true }, (error, data) => {
    if (error) {
      callback(true, "Unable to fetch data, Please try again. " + error);
    }
    callback(false, data?.body);
    // data?.body means that if body exists in data return it
  });
};

module.exports = weatherData;