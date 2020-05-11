var apiKey = "287b19e546f827a01d779e91f3882bc3";
var date = moment().format("l");

$("#btnSubmit").on("click", function (e) {
  e.preventDefault();
  var cityName = $("#userInput").val();
  currentWeather(cityName);
});

function currentWeather(cityName) {
  $.ajax({
    method: "GET",
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    dataType: "json",
  }).then(function (res) {
    console.log(res);

    $("#cityName").text(res.name);
    $("#date").text(date);
    $("#icon").prepend(
      `<img src="https://openweathermap.org/img/wn/${res.weather[0].icon}.png">`
    );
    $("#temp").text(`Temperature: ${res.main.temp}`);
    $("#humidity").text(`Humidity: ${res.main.humidity}`);

    // converting wind speed from meters per second to miles per hour
    var windSpeedMPS = res.wind.speed;
    var windSpeedMPH = windSpeedMPS * 2.237;
    $("#wind").text(`Wind Speed: ${windSpeedMPH} mph`);

    // $("#currentWeather").append(
    //   `<p>Current Weather: ${data.main.temp}</p>
    //   <p>Wind: ${data.wind.speed}</p>
    //   <p>Humidty: ${data.main.humidity}</p>
    //   <p>Description: ${data.weather[0].main}</p>
    //   <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
    // );
    var lat = res.coord.lat;
    var lon = res.coord.lon;
  });
}

// function currentWeather(cityName) {
//   var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
//   console.log(url);
//   $.ajax({
//     method: "GET",
//     url: url,
//     dataType: "json",
//   }).then(function (data) {
//     console.log("API Response", data);
//     //     $("#currentWeather").append(
//     //       `<p>Current Weather: ${data.main.temp}</p>
//     //       <p>Wind: ${data.wind.speed}</p>
//     //       <p>Humidty: ${data.main.humidity}</p>
//     //       <p>Description: ${data.weather[0].main}</p>
//     //       <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">`
//     //     );
//     //     var lat = data.coord.lat;
//     //     var lon = data.coord.lon;
//   });
// }
