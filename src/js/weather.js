
var xAxisDate = [];
var currentTempGraph = [];
var chart;
const apiKey = "5264779432aa5523b400895723caa06e";
const proxy = "https://cors-anywhere.herokuapp.com/";
var latitude;
var longitude;
const count = 10;
var tempValue;
let tempFaren;
let climate;
var todayDate;
var todayDateis;
var getTodayDate;
var getTodayImage;
var showReport = '<span>';
var citySearchReport = '<span>';
var currentDay;
var currentTempMorning;
var currentTempDay;
var currentTempEvening;
var currentTempNight;
var todayAllDay= [];
var searchTempAllDay= [];
var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log("Denied");
  }
});

function success(position) {
  geoLocation(position);
}

function error(err) {
  document.getElementById("loading").style.display = "none";
}

// if user allows geoLocation
function geoLocation(data) {
  latitude = data.coords.latitude;
  longitude = data.coords.longitude;
  const api = `${proxy}api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=${count}&appid=${apiKey}`;
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById("loading").style.display = "none";
      todayAllDay.push(Math.round(data.list[0].feels_like.morn - 273));
      todayAllDay.push(Math.round(data.list[0].feels_like.day - 273));
      todayAllDay.push(Math.round(data.list[0].feels_like.eve - 273));
      todayAllDay.push(Math.round(data.list[0].feels_like.night - 273));
      for (var i = 0; i < data.list.length; i++) {
        currentTemp(data);
        todayDate = new Date(data.list[i].dt * 1000);
        currentDay = todayDate.toLocaleString("locale", { weekday: "short" });
        todayDateis =
          todayDate.getDate() +
          " " +
          todayDate.toLocaleString("default", { month: "short" });
        xAxisDate.push(todayDateis);

        let Todaytemp = data.list[i].feels_like.day;
        tempValue = Math.round(Todaytemp - 273);
        climate = data.list[i].weather[0].main;
        tempFaren = Math.round((tempValue * 9) / 5 + 32);
        let sunRise = new Date(data.list[i].sunrise * 1000);
        let sunSet = new Date(data.list[i].sunset * 1000);
        let a = sunSet.getHours() % 12 || 12;
        let sunRiseTime = sunRise.getHours() + ":" + sunRise.getMinutes();
        let sunSetTime = a + ":" + sunSet.getMinutes();
        document.getElementById("Sunrise").innerHTML = sunRiseTime;
        document.getElementById("Sunset").innerHTML = sunSetTime;      
        showReport += "<div class='weather_day'>";
        showReport += "<p id='day'>" + currentDay + "</p>";
        showReport +=
          "<p class='temp'>" +
          "<span id='tempInCelcius'>" +
          tempValue +
          "&deg" +
          "</span>" +
          " " +
          "<span id='tempInFaren'>" +
          tempFaren +
          "&deg" +
          "</span>" +
          "</p>";
        showReport +=
          "<p class='image'><img src='https://openweathermap.org/img/w/" +
          data.list[i].weather[0].icon +
          ".png'></p>";
        showReport += "<p class='status'>" + climate + "</p>";
        showReport += "</div> ";
        showReport += "</span> ";
        document.getElementById("weather_days").innerHTML = showReport;
        document.getElementById("pressure").innerHTML = data.list[i].pressure;
        document.getElementById("humidity").innerHTML = data.list[i].humidity;
      }
      $("#chart2").hide();
      $("#chart").show();
      chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    })
    .catch((error) => {
      alert("Weather Upadte failed, Try Again");
    });
}

// when user search in input box
function searchCity() {
  document.getElementById("loading").style.display = "block";  
  let input = document.getElementById("searchBox").value;
  const api = `${proxy}api.openweathermap.org/data/2.5/forecast/daily?q=${input}&cnt=${count}&appid=${apiKey}`;
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((citySearch) => {
      document.getElementById("loading").style.display = "none";
      searchTempAllDay.push(Math.round(citySearch.list[0].feels_like.morn - 273));
      searchTempAllDay.push(Math.round(citySearch.list[0].feels_like.day - 273));
      searchTempAllDay.push(Math.round(citySearch.list[0].feels_like.eve - 273));
      searchTempAllDay.push(Math.round(citySearch.list[0].feels_like.night - 273));      
      for (let i = 0; i < citySearch.list.length; i++) {
        todayDate = new Date(citySearch.list[i].dt * 1000);
        currentDay = todayDate.toLocaleString("locale", { weekday: "short" });
        todayDateis =
          todayDate.getDate() +
          " " +
          todayDate.toLocaleString("default", { month: "short" });
        xAxisDate.push(todayDateis);
        let Todaytemp = citySearch.list[i].feels_like.day;
        tempValue = Math.round(Todaytemp - 273);
        climate = citySearch.list[i].weather[0].main;
        tempFaren = Math.round((tempValue * 9) / 5 + 32);    
        citySearchReport += "<div class='weather_day'>";
        citySearchReport += "<p id='day'>" + currentDay + "</p>";
        citySearchReport +=
          "<p class='temp'>" +
          "<span id='tempInCelcius'>" +
          tempValue +
          "&deg" +
          "</span>" +
          " " +
          "<span id='tempInFaren'>" +
          tempFaren +
          "&deg" +
          "</span>" +
          "</p>";
        citySearchReport +=
          "<p class='image'><img src='https://openweathermap.org/img/w/" +
          citySearch.list[i].weather[0].icon +
          ".png'></p>";
        citySearchReport += "<p class='status'>" + climate + "</p>";
        citySearchReport += "</div> ";
        citySearchReport += "</div> ";

        document.getElementById("weather_days").innerHTML = citySearchReport;
        document.getElementById("pressure").innerHTML =
          citySearch.list[i].pressure;
        document.getElementById("humidity").innerHTML =
          citySearch.list[i].humidity;

        let sunRise = new Date(citySearch.list[i].sunrise * 1000);
        let sunSet = new Date(citySearch.list[i].sunset * 1000);
        let a = sunSet.getHours() % 12 || 12;
        let sunRiseTime = sunRise.getHours() + ":" + sunRise.getMinutes();
        let sunSetTime = a + ":" + sunSet.getMinutes();
        document.getElementById("Sunrise").innerHTML = sunRiseTime;
        document.getElementById("Sunset").innerHTML = sunSetTime;
      }
      currentTemp(citySearch);
      $("#chart").hide();
      $("#chart2").show();
      chart = new ApexCharts(document.querySelector("#chart2"), options2);
      chart.render();
      
      chart.updateSeries([{
        data: searchTempAllDay
      }]);
      searchTempAllDay = [];
      
 citySearchReport = '';
    });
}

$(document).ready(function () {
  $("#searchIcon").click(function () {
    searchCity();
  });
});


$(document).keypress(function (event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == "13") {
    searchCity();
  }
});

var options = {
  chart: {
    type: "line",
    height: "400",
  },
  series: [
    {
      name: "temperature",
      data: todayAllDay,
    },
  ],
  xaxis: {
    categories: ['Morning','Day','Evening','Night'],
  },
};

var options2 = {
  chart: {
    type: "line",
    height: "400",
  },  
  series: [
    {
      name: "temperature",
      data: searchTempAllDay,
    },
  ],
  xaxis: {
    categories: ['Morning','Day','Evening','Night'],
  },
};

//daily Details
function currentTemp(current) {
  getTodayDate = Math.round(current.list[0].feels_like.day - 273);
  var iconcode = current.list[0].weather[0].icon;
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  $("#wicon").attr("src", iconurl);
  document.getElementById("todayTempIs").innerHTML = getTodayDate;
}
