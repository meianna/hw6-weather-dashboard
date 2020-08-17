$(document).ready(function () {
  // declaring API key and current day/date in global scope
  var apiKey = "287b19e546f827a01d779e91f3882bc3";
  var day = moment().format("dddd");
  var date = moment().format("l");
  var cities = JSON.parse(localStorage.getItem("cities")) || [];

  // hiding currentWeather and futureWeather containers until submit button is clicked
  $("#currentWeather").hide();
  $("#futureWeather").hide();
  $("#searchHistory").hide();

  // Submit button on click function
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
    $("#searchHistory").show();

    // accessing weather API
    $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`,
      dataType: "json",
    }).then(function (res) {
      var windSpeedMPS = res.wind.speed;
      var windSpeedMPH = windSpeedMPS * 2.237;
      var wind = windSpeedMPH.toFixed(0);

      // seach history/local storage
      if (cities.indexOf(cityName) === -1) {
        cities.push(res.name);
      }
      localStorage.setItem("cities", JSON.stringify(cities));
      $("#searchHistory").html("");
      for (var i = 0; i < cities.length; i++) {
        $("#searchHistory").prepend(`
        <li class="list-group-item">${cities[i]}</li>  
        `);
        $("li").click(function (event) {
          $("input").val($(this).text());
          $("#btnSubmit").click();
        });
      }

      // current weather info
      $("#weather").html(`<div class="card-header">
      <h2 class="card-title" id="cityName">${res.name}</h2>
      <h5>${day}</h5>
      <h5>${date}</h5>
    </div>
    <div class="card-body card-text">
      <div><img src="https://openweathermap.org/img/wn/${
        res.weather[0].icon
      }.png"></div>
      <h4>Temperature: ${res.main.temp.toFixed(0)}°F</h4>
      <h4>Humidity: ${res.main.humidity}%</h4>
      <h4>Wind Speed: ${wind} mph</h4>
      <h4 id="uv"></h4>
    </div>`);

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
        const uv = res.value.toFixed(0);
        console.log(uv);
        $("#uv").html(
          "UV Index: " +
            '<span class="badge badge-light text-white" id="uvColor">' +
            uv +
            "</span>"
        );
        if (uv >= 8) {
          $("#uvColor").css("background-color", "crimson");
        } else if (uv <= 7 && uv >= 5) {
          $("#uvColor").css("background-color", "royalblue");
        } else {
          $("#uvColor").css("background-color", "limegreen");
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
      $("#futureWeather").empty();
      var forecast = res.list;
      for (let i = 0; i < forecast.length; i = i + 8) {
        $("#futureWeather").append(`
        <div class="col mb-4">
          <div class="card text-white bg-primary">
            <div class="card-body">
              <h5 class="card-title">${moment(forecast[i].dt_txt).format(
                "l"
              )}</h5>
              <div><img src="https://openweathermap.org/img/wn/${
                forecast[i].weather[0].icon
              }.png"</div>
              <p class="card-text">Temp: ${forecast[i].main.temp.toFixed(
                0
              )}°F</p>
              <p class="card-text">Humidity: ${forecast[i].main.humidity}%</p>
            </div>
          </div>
        </div>`);
      }
    });
  }
});
