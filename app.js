var apiKey = "287b19e546f827a01d779e91f3882bc3";
var date = moment().format("l");

$("#btnSubmit").on("click", function (e) {
  e.preventDefault();
  var cityName = $("#userInput").val();
  $("#userInput").val("");
  currentWeather(cityName);
  futureWeather(cityName);
});

function currentWeather(cityName) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    dataType: "json",
  }).then(function (res) {
    console.log(res);

    // prepends search history to ul
    $("#searchHistory").prepend(`<li class="render">${res.name}</li>`);

    $("#cityName").text(res.name);
    $("#date").text(date);

    // can't figure out how to clear this after entering each city
    $("#icon").html(
      `<img src="https://openweathermap.org/img/wn/${res.weather[0].icon}.png">`
    );

    // converting kelvin to fahrenheit for temperature
    var kelvin = res.main.temp;
    var fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
    var temp = fahrenheit.toFixed(0);
    $("#temp").text(`Temperature: ${temp}°F`);

    // not sure how to convert humidity value to %
    $("#humidity").text(`Humidity: ${res.main.humidity}`);

    // converting wind speed from meters per second to miles per hour
    var windSpeedMPS = res.wind.speed;
    var windSpeedMPH = windSpeedMPS * 2.237;
    var wind = windSpeedMPH.toFixed(0);
    $("#wind").text(`Wind Speed: ${wind} mph`);

    // UV Index. This dats seems incorrect, way too high
    var lat = res.coord.lat;
    var lon = res.coord.lon;

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

function futureWeather(cityName) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`,
    dataType: "json",
  }).then(function (res) {
    console.log(res);
    // adding forecast dates to html
    $("#dateForecast1").text(res.list[2].dt_txt);
    $("#dateForecast2").text(res.list[10].dt_txt);
    $("#dateForecast3").text(res.list[18].dt_txt);
    $("#dateForecast4").text(res.list[26].dt_txt);
    $("#dateForecast5").text(res.list[34].dt_txt);

    //     $("#currentWeather").append(
    //       `<p>Current Weather: ${data.main.temp}</p>
    //       <p>Wind: ${data.wind.speed}</p>
    //       <p>Humidty: ${data.main.humidity}</p>
    //       <p>Description: ${data.weather[0].main}</p>
    //       <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
    //     );
  });
}
