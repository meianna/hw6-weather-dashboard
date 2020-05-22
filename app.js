$(document).ready(function () {
  // declaring API key and current day/date in global scope
  var apiKey = "287b19e546f827a01d779e91f3882bc3";
  var day = moment().format("dddd");
  var date = moment().format("l");

  // hiding currentWeather and futureWeather containers until submit button is clicked
  $("#currentWeather").hide();
  $("#futureWeather").hide();

  // Submit button on click function
  $("#btnSubmit").on("click", function (e) {
    e.preventDefault();
    var cityName = $("#userInput").val();
    $("#userInput").val("");
    currentWeather(cityName);
    futureWeather(cityName);
    searchHistory();
  });

  // current weather function
  function currentWeather(cityName) {
    // showing currentWeather container
    $("#currentWeather").show();

    // accessing weather API
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`,
      dataType: "json",
    }).then(function (res) {
      // adds search history to ul
      $("#searchHistory").prepend(`<li class="previousCity">${res.name}</li>`);
      var previousSearch = JSON.parse(localStorage.getItem("city")) || [];
      console.log(previousSearch);
      previousSearch.push(res.name);
      localStorage.setItem("city", JSON.stringify(previousSearch));

      // adds city name to html
      $("#cityName").text(res.name);

      // adds current day and date to html
      $("#day").text(day);
      $("#date").text(date);

      // adds icon of current weather to html
      $("#icon").html(
        `<img src="https://openweathermap.org/img/wn/${res.weather[0].icon}.png">`
      );

      // rounding temperature to whole number and adding to html
      $("#temp").text(`Temperature: ${res.main.temp.toFixed(0)}°F`);

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
      // This dats seems incorrect, way too high.
      $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
        dataType: "json",
      }).then(function (res) {
        var uv = res.value.toFixed(0);
        if (uv >= 8) {
          $("#uv").html(`<p class="uvSevere">UV Index:  ${uv}</p>`);
        } else if (uv <= 7 && uv >= 5) {
          $("#uv").html(`<p class="uvModerate">UV Index: ${uv}</p>`);
        } else {
          $("#uv").html(`<p class="uvFavorable">UV Index:  ${uv}</p>`);
        }
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
      url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`,
      dataType: "json",
    }).then(function (res) {
      // adding forecast dates to card.
      $("#dateForecast1").text(moment(res.list[0].dt_txt).format("l"));
      $("#dateForecast2").text(moment(res.list[8].dt_txt).format("l"));
      $("#dateForecast3").text(moment(res.list[16].dt_txt).format("l"));
      $("#dateForecast4").text(moment(res.list[24].dt_txt).format("l"));
      $("#dateForecast5").text(moment(res.list[32].dt_txt).format("l"));

      // adding forecast icons to card
      $("#iconForecast1").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[0].weather[0].icon}.png">`
      );
      $("#iconForecast2").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[8].weather[0].icon}.png">`
      );
      $("#iconForecast3").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[16].weather[0].icon}.png">`
      );
      $("#iconForecast4").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[24].weather[0].icon}.png">`
      );
      $("#iconForecast5").html(
        `<img src="https://openweathermap.org/img/wn/${res.list[32].weather[0].icon}.png">`
      );

      // adding forecast temp to cards

      $("#tempForecast1").text(`Temp: ${res.list[0].main.temp.toFixed(0)}°F`);
      $("#tempForecast2").text(`Temp: ${res.list[8].main.temp.toFixed(0)}°F`);
      $("#tempForecast3").text(`Temp: ${res.list[16].main.temp.toFixed(0)}°F`);
      $("#tempForecast4").text(`Temp: ${res.list[24].main.temp.toFixed(0)}°F`);
      $("#tempForecast5").text(`Temp: ${res.list[32].main.temp.toFixed(0)}°F`);

      // adding humidity for each day to card
      $("#humidityForecast1").text(`Humidity: ${res.list[0].main.humidity}%`);
      $("#humidityForecast2").text(`Humidity: ${res.list[8].main.humidity}%`);
      $("#humidityForecast3").text(`Humidity: ${res.list[16].main.humidity}%`);
      $("#humidityForecast4").text(`Humidity: ${res.list[24].main.humidity}%`);
      $("#humidityForecast5").text(`Humidity: ${res.list[32].main.humidity}%`);
    });
  }

  // search history on click function
  function searchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("city")) || [];
    $("#searchHistory").empty();
    for (i = 0; i < searchHistory.length; i++) {
      $("#searchHistory").prepend(
        `<li class="previousCity">${searchHistory[i]}</li>`
      );
    }

    $(document).on("click", ".previousCity", function () {
      var text = $(this).text();
      console.log(text);

      $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=imperial`,
        dataType: "json",
      }).then(function (res) {
        $("#cityName").text(res.name);
        $("#day").text(day);
        $("#date").text(date);
        $("#icon").html(
          `<img src="https://openweathermap.org/img/wn/${res.weather[0].icon}.png">`
        );
        $("#temp").text(`Temperature: ${res.main.temp.toFixed(0)}°F`);
        $("#humidity").text(`Humidity: ${res.main.humidity}%`);
        var windSpeedMPS = res.wind.speed;
        var windSpeedMPH = windSpeedMPS * 2.237;
        var wind = windSpeedMPH.toFixed(0);
        $("#wind").text(`Wind Speed: ${wind} mph`);
        var lat = res.coord.lat;
        var lon = res.coord.lon;
        $.ajax({
          method: "GET",
          url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`,
          dataType: "json",
        }).then(function (res) {
          var uv = res.value.toFixed(0);
          if (uv >= 8) {
            $("#uv").html(`<p class="uvSevere">UV Index:  ${uv}</p>`);
          } else if (uv <= 7 && uv >= 5) {
            $("#uv").html(`<p class="uvModerate">UV Index: ${uv}</p>`);
          } else {
            $("#uv").html(`<p class="uvFavorable">UV Index:  ${uv}</p>`);
          }
        });
      });

      $.ajax({
        method: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${text}&appid=${apiKey}&units=imperial`,
        dataType: "json",
      }).then(function (res) {
        $("#dateForecast1").text(moment(res.list[0].dt_txt).format("l"));
        $("#dateForecast2").text(moment(res.list[8].dt_txt).format("l"));
        $("#dateForecast3").text(moment(res.list[16].dt_txt).format("l"));
        $("#dateForecast4").text(moment(res.list[24].dt_txt).format("l"));
        $("#dateForecast5").text(moment(res.list[32].dt_txt).format("l"));
        $("#iconForecast1").html(
          `<img src="https://openweathermap.org/img/wn/${res.list[0].weather[0].icon}.png">`
        );
        $("#iconForecast2").html(
          `<img src="https://openweathermap.org/img/wn/${res.list[8].weather[0].icon}.png">`
        );
        $("#iconForecast3").html(
          `<img src="https://openweathermap.org/img/wn/${res.list[16].weather[0].icon}.png">`
        );
        $("#iconForecast4").html(
          `<img src="https://openweathermap.org/img/wn/${res.list[24].weather[0].icon}.png">`
        );
        $("#iconForecast5").html(
          `<img src="https://openweathermap.org/img/wn/${res.list[32].weather[0].icon}.png">`
        );
        $("#tempForecast1").text(`Temp: ${res.list[0].main.temp.toFixed(0)}°F`);
        $("#tempForecast2").text(`Temp: ${res.list[8].main.temp.toFixed(0)}°F`);
        $("#tempForecast3").text(
          `Temp: ${res.list[16].main.temp.toFixed(0)}°F`
        );
        $("#tempForecast4").text(
          `Temp: ${res.list[24].main.temp.toFixed(0)}°F`
        );
        $("#tempForecast5").text(
          `Temp: ${res.list[32].main.temp.toFixed(0)}°F`
        );
        $("#humidityForecast1").text(`Humidity: ${res.list[0].main.humidity}%`);
        $("#humidityForecast2").text(`Humidity: ${res.list[8].main.humidity}%`);
        $("#humidityForecast3").text(
          `Humidity: ${res.list[16].main.humidity}%`
        );
        $("#humidityForecast4").text(
          `Humidity: ${res.list[24].main.humidity}%`
        );
        $("#humidityForecast5").text(
          `Humidity: ${res.list[32].main.humidity}%`
        );
      });
    });
  }
});
