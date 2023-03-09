var cityInputEl = document.querySelector(".city-input");
var searchFormEl = document.querySelector(".form");
var searchButtonEl = document.querySelector(".search-btn");
var cityResultEl = document.querySelector(".city-result");
var fiveDayEl = document.querySelector("#fiveDay");
var searchedCityEl = document.querySelector("#searchedCity");

var tempForecastEl = document.querySelector(".temp");
var windForecastEl = document.querySelector(".wind");
var humidityForecastEl = document.querySelector(".humidity");
var weatherResultsEl = document.querySelector(".weather-results");
var currentConditionsEl = document.querySelector(".current-conditions");
var weatherAPIKey = "4d63438f945ad1272576e0d07d7abdb7";
var cityList = [];

var weatherSearch = function (cityName) {
  var urlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherAPIKey}&units=imperial`;
  fetch(urlCurrentWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (currentData) {
      console.log(currentData);
      var urlOneCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&exclude={part}&appid=${weatherAPIKey}&units=imperial`;
      fetch(urlOneCall)
        .then(function (response) {
          return response.json();
        })
        .then(function (fivedayData) {
          console.log(fivedayData);
          cityList.push(currentData.name);
          localStorage.setItem("cityList", JSON.stringify(cityList));
          populateCity();
          cityResultEl.innerHTML =
            currentData.name +
            moment(currentData.dt, "X").format(" (MM/DD/YYYY) ") +
            `<img class="w-2"
                    src="http://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" />`;
          tempForecastEl.innerHTML = "Temp: " + fivedayData.current.temp + "°F";
          windForecastEl.innerHTML = "Wind: " + fivedayData.current.wind_speed;
          humidityForecastEl.innerHTML =
            "Humidity: " + fivedayData.current.humidity;

 
          fiveDayEl.innerHTML = "";
          var card = "";
          for (let i = 1; i < 6; i++) {
            console.log(fivedayData.daily[i].weather[0].icon);
            card =
              card +
              `<div class="col-sm-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${moment(
                fivedayData.daily[i].dt,
                "X"
              ).format("MM/DD/YYYY")}</h5>
                            <img class="w-50" src="http://openweathermap.org/img/wn/${fivedayData.daily[i].weather[0].icon
              }@2x.png" />
                            <p class="card-text">Temp: ${fivedayData.daily[i].temp.day
              }°F</p>
                            <p class="card-text">Wind: ${fivedayData.daily[i].wind_speed
              }</p>
                            <p class="card-text">Humidity: ${fivedayData.daily[i].humidity
              }</p>
                        </div>
                    </div>
                </div>`;
          }
          fiveDayEl.innerHTML = card;
        });
    });
};

var populateCity = function () {
  var cityData = JSON.parse(localStorage.getItem("cityList"));
  if (cityData) {
    cityList = cityData;
    searchedCityEl.innerHTML = "";
    for (i = 0; i < cityList.length; i++) {
      searchedCityEl.innerHTML += `<li class="list-group-item border-0"><button class="btn history-btn w-100"
        type="button">${cityList[i]}</button></li>`;
    }
  }
  var historyButtonEl = document.querySelectorAll(".history-btn");
  for (i = 0; i < historyButtonEl.length; i++) {
    historyButtonEl[i].addEventListener("click", showCity);
  }
};
populateCity();

var showCity = function () {
  weatherSearch(this.textContent);
};

var citySearch = function () {
  var cityName = cityInputEl.value;
  weatherSearch(cityName);
};

searchButtonEl.addEventListener("click", citySearch);