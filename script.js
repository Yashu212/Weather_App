const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");
const er = document.querySelector('.error-container');

let currentTab = userTab;
const API_key = 'd7ec7d08faa649b3391fd94635e33e18';
currentTab.classList.add("current-tab");
getfromSessionStorage();
userTab.addEventListener('click',() => {
    switchTab(userTab);
});

searchTab.addEventListener('click',() =>{
    switchTab(searchTab);
});

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        er.classList.remove("active");
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            getfromSessionStorage();
            
        }
    }
}

function getfromSessionStorage(){
    //this function checksif coordinates are already present in session storage
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
        grantAccessContainer.classList.add("active");
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates)
{
    const {lat,long} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_key}&units=metric`);
        const data = await response.json()
        if(data?.name ===  undefined)
        {
            throw undefined;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        er.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo)
{
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weather-desc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0].icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}℃`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
grantAccessBtn.addEventListener('click',getLocation);

function getLocation()
{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        grantAccessContainer.classList.remove("active");
        er.classList.add("active");
    }
}

function showPosition(position)
{
    const userCoordinates = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let city_name = searchInput.value;
    if(city_name == "")
        return;
    else    
        fetchSearchWeatherInfo(city_name);
})

async function fetchSearchWeatherInfo(city)
{
    userInfoContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
          );
        const data = await response.json();
        if(data?.name ===  undefined)
        {
            throw undefined;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    }
    catch(err){
        loadingScreen.classList.remove("active");
        er.classList.add("active");
    }
}