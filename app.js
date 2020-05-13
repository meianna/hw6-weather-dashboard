$(document).ready(function () {
  // declaring API key and current date in global scope
  var apiKey = "287b19e546f827a01d779e91f3882bc3";
  var date = moment().format("l");

  // hiding currentWeather and futureWeather containers until submit button is clicked
  $("#currentWeather").hide();
  $("#futureWeather").hide();

  // Submit button on click function triggers everything
  $("#btnSubmit").on("click", function (e) {
    e.preventDefault();
    var cityName = $("#userInput").val();
    $("#userInput").val("");
    currentWeather(cityName);
    futureWeather(cityName);
  });

  // current weather function
  function currentWeather(cityName) {
    // showing currentWeather container
    $("#currentWeather").show();

    // accessing weather API and console logging result
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
      dataType: "json",
    }).then(function (res) {
      console.log(res);

      // adds search history to ul
      $("#searchHistory").prepend(`<li class="render">${res.name}</li>`);

      // adds city name to html
      $("#cityName").text(res.name);

      // adds current date to html
      $("#date").text(date);

      // adds icon of current weather to html
      $("#icon").html(
        `<img src="https://openweathermap.org/img/wn/${res.weather[0].icon}.png">`
      );

      // converting kelvin to fahrenheit for temperature and adding to html
      var kelvin = res.main.temp;
      var fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
      var temp = fahrenheit.toFixed(0);
      $("#temp").text(`Temperature: ${temp}°F`);

      // adds humidty to html
      $("#humidity").text(`Humidity: ${res.main.humidity}%`);

      // converting wind speed from meters per second to miles per hour and adding to html
      var windSpeedMPS = res.wind.speed;
      var windSpeedMPH = windSpeedMPS * 2.237;
      var wind = windSpeedMPH.toFixed(0);
      $("#wind").text(`Wind Speed: ${wind} mph`);

      // declaring vars for lat and lon coordinates to get UV index
      var lat = res.coord.lat;
      var lon = res.coord.lon;

      // creating separate API request for UV Index and adding to html.
      // This dats seems incorrect, way too high. Can't figure out if I'm supposed to convert the value somehow
      $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        dataType: "json",
      }).then(function (res) {
        var uv = res.value.toFixed(0);
        $("#uv").text(`UV Index: ${uv}`);
      });
    });
  }

  // 5-day forecast weather function
  function futureWeather(cityName) {
    // showing forecast container
    $("#futureWeather").show();

    // accessing forecast API and console logging result
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`,
      dataType: "json",
    }).then(function (res) {
      console.log(res);

      // adding forecast dates to card. I think there's a better way to do this...
      $("#dateForecast1").text(res.list[2].dt_txt);
      $("#dateForecast2").text(res.list[10].dt_txt);
      $("#dateForecast3").text(res.list[18].dt_txt);
      $("#dateForecast4").text(res.list[26].dt_txt);
      $("#dateForecast5").text(res.list[34].dt_txt);

      // adding forecast icons to card
      $("#iconForecast1").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[2].weather[0].icon}.png">`
      );
      $("#iconForecast2").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[10].weather[0].icon}.png">`
      );
      $("#iconForecast3").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[18].weather[0].icon}.png">`
      );
      $("#iconForecast4").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[26].weather[0].icon}.png">`
      );
      $("#iconForecast5").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[34].weather[0].icon}.png">`
      );

      // converting the temp of each day of the forecast from kelvin to fahrenheit and adding to card
      // feels like there should be an easier way to do this
      var kelvinForecast1 = res.list[2].main.temp;
      var fahrenheitForecast1 = ((kelvinForecast1 - 273.15) * 9) / 5 + 32;
      var tempForecast1 = fahrenheitForecast1.toFixed(0);
      $("#tempForecast1").text(`Temp: ${tempForecast1}°F`);

      var kelvinForecast2 = res.list[10].main.temp;
      var fahrenheitForecast2 = ((kelvinForecast2 - 273.15) * 9) / 5 + 32;
      var tempForecast2 = fahrenheitForecast2.toFixed(0);
      $("#tempForecast2").text(`Temp: ${tempForecast2}°F`);

      var kelvinForecast3 = res.list[18].main.temp;
      var fahrenheitForecast3 = ((kelvinForecast3 - 273.15) * 9) / 5 + 32;
      var tempForecast3 = fahrenheitForecast3.toFixed(0);
      $("#tempForecast3").text(`Temp: ${tempForecast3}°F`);

      var kelvinForecast4 = res.list[26].main.temp;
      var fahrenheitForecast4 = ((kelvinForecast4 - 273.15) * 9) / 5 + 32;
      var tempForecast4 = fahrenheitForecast4.toFixed(0);
      $("#tempForecast4").text(`Temp: ${tempForecast4}°F`);

      var kelvinForecast5 = res.list[34].main.temp;
      var fahrenheitForecast5 = ((kelvinForecast5 - 273.15) * 9) / 5 + 32;
      var tempForecast5 = fahrenheitForecast5.toFixed(0);
      $("#tempForecast5").text(`Temp: ${tempForecast5}°F`);

      // adding humidity for each day to card
      $("#humidityForecast1").text(`Humidity: ${res.list[2].main.humidity}%`);
      $("#humidityForecast2").text(`Humidity: ${res.list[10].main.humidity}%`);
      $("#humidityForecast3").text(`Humidity: ${res.list[18].main.humidity}%`);
      $("#humidityForecast4").text(`Humidity: ${res.list[26].main.humidity}%`);
      $("#humidityForecast5").text(`Humidity: ${res.list[34].main.humidity}%`);
    });
  }
});
