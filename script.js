const wrapper = document.querySelector(".wrapper"),
    inputPart = wrapper.querySelector(".input-part"),
    infoTxt = inputPart.querySelector(".info-txt"),
    inputField = inputPart.querySelector("input"),
    locationBtn = inputPart.querySelector("button"),
    wIcon = document.querySelector(".weather-part img"),
    arrowBack = wrapper.querySelector("header i");

let apiKey = "APIKEY";
let api;
inputField.addEventListener("keyup", e => {
    // si l'utilisateur appuie sur entrer et que la valeur n'est pas null
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Ton navigateur ne supporte pas la géolocalisation de l'api")
    }
});

function onSuccess(position) {
    console.log(position);
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey} `;
    fetchData();
}

function fetchData() {
    infoTxt.innerText = "Information détaillée météo";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    infoTxt.classList.replace("pending", "error");
    if (info.cod == "404") {
        infoTxt.innerText = `${inputField.value} n'est pas un nom de ville valide`;
    } else {
        //On recupére les informations dans l'api
        const city = info.name;
        const country = info.sys.country;
        const { description, id } = info.weather[0];
        const { feels_like, humidity, temp } = info.main;

        //On modifie l'image en fonction de l'id (qui correspond à la meteo exemple : pluie, neige etc..)
        if (id == 800) {
            wIcon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            wIcon.src = "icons/storm.svg";
        } else if (id >= 600 && id <= 622) {
            wIcon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            wIcon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            wIcon.src = "icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            wIcon.src = "icons/rain.svg";
        }

        //On les stocks dans les balises HTML
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }

}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active");
});