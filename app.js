var apiKey = "287b19e546f827a01d779e91f3882bc3";

$("#btnSubmit").on("click", function (e) {
  e.preventDefault();
  var cityName = $("#userInput").val();
  console.log(cityName);
  currentWeather(cityName);
});

function currentWeather(cityName) {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  console.log(url);
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
  }).then(function (data) {
    console.log("API Response", data);
    $("#currentWeatherContainer").append(
      `<p>Current Weather: ${data.main.temp}</p>
      <p>Wind: ${data.wind.speed}</p>
      <p>Humidty: ${data.main.humidity}</p>
      <p>Description: ${data.weather[0].main}</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
    );
    var lat = data.coord.lat;
    var lon = data.coord.lon;
  });
}

function currentWeather(cityName) {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  console.log(url);
  $.ajax({
    method: "GET",
    url: url,
    dataType: "json",
  }).then(function (data) {
    console.log("API Response", data);
    //     $("#currentWeatherContainer").append(
    //       `<p>Current Weather: ${data.main.temp}</p>
    //       <p>Wind: ${data.wind.speed}</p>
    //       <p>Humidty: ${data.main.humidity}</p>
    //       <p>Description: ${data.weather[0].main}</p>
    //       <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
    //     );
    //     var lat = data.coord.lat;
    //     var lon = data.coord.lon;
  });
}
