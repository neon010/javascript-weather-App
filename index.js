const iconElement = document.getElementById("weather-icon");
const tempElement = document.getElementById("temp");
const locationElement = document.getElementById("location");
const notificationElement = document.getElementById("notification");
const windSpeedElement = document.getElementById("windSpeed");
const humidityElement = document.getElementById("humidity");
const visibilityElement = document.getElementById("visibility");


//Weather data object and constant 

const weather = {};
weather.temperature = {
    unit:"celcius"
}


const KELVIN = 273;
const key = "3ec235997e9e3989584401f644fa7109";

// Check for browser geolocation support

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// Set user position

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// API Call
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.windSpeed = data.wind.speed;
            weather.windDirection = data.wind.deg;
            weather.humidity = data.main.humidity;
            weather.visibility = data.visibility;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
}

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>
                            <p id="temperature-description">${weather.description}</p>`;
    tempElement.innerHTML = `${weather.temperature.value}<span id="degree">°C</span>`;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    windSpeedElement.innerHTML = `wind: ${Math.round(weather.windSpeed *10)} Km/hr, ${windDirection(weather.windDirection)} `
    humidityElement.innerHTML = `humidity : ${weather.humidity}%`;
    visibilityElement.innerHTML = `visibility : ${weather.visibility/100} Km`;
}
//wind direction conversion from deg to text direction

function windDirection(deg){
    if(deg == 0 || deg == 360){
        return "North";
    }
    else if(deg < 90 && deg > 0){
        return "North-East";
    }
    else if(deg == 90){
        return "East"
    }
    else if(deg < 180 && deg > 90){
        return "South-East";
    }
    else if(deg == 180){
        return "South";
    }
    else if(deg < 270 && deg > 180){
        return "South-West"
    }
    else if(deg == 270 ){
        return "West";
    }
    else if( deg < 360 && deg > 270){
        return "North-West"
    }
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});


//date-time display

let dateTime = new Date();

function getdate(){
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth();
    let monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let monthName = monthList[month];
    let dayList =["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let dayNum = dateTime.getDay();
    let day = dayList[dayNum];
    let date = dateTime.getDate();
    let printDay = document.getElementById("day");
    let printMonthName = document.getElementById("month");
    let printDate = document.getElementById("day-number");
    let printYear = document.getElementById("year");
    printDay.textContent = day;
    printMonthName.textContent = monthName;
    printDate.textContent = parseInt(date) < 10 ? `0${date}`: date;
    printYear.textContent = year;

}
function setClock(){
    let dateTime = new Date();
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();
    let second = dateTime.getSeconds();
    let printHour = document.getElementById("hour");
    let printMinute = document.getElementById("minute");
    let printSecond = document.getElementById("second");
    printHour.innerText = hour < 10 ? `0${hour}`: `${hour}`;
    printMinute.textContent = minute < 10 ? `0${minute}`:minute;
    printSecond.textContent = second < 10 ? `0${second}`: second;

    let session = document.getElementById("session");
    session.textContent = hour >= 12 ? "PM" :"AM";

}
getdate();
setInterval(getdate,1000);
setInterval(setClock,1000);
setClock();