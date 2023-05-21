
const searchBtn = document.querySelector('#searchBtn');

document.querySelector('#location').addEventListener('click', () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError)

    }
    document.querySelector('#loading').style.display = "block";
});

async function onSuccess(position) {
    document.querySelector('#loading').style.display = "none";
    try {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
    
        let api_key = "4e20b56d9bf342fa88b409ffad7dbd10";
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;
        const response = await fetch(url);

        if(!response.ok)
            throw new Error("ülke bulunamadı");

        const data = await response.json();
    
        let api_key2 = "5727d65de647401676e1f8594f7d5446"; 
        let url2 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key2}&lang=tr&units=metric`;
    
        const response2 = await fetch(url2);
        const data2 = await response2.json();
    
        diplayData(data, data2);
    }
    catch(err) {
        renderError(err);
    }
}

function onError(err) {
    console.log(err);
    document.querySelector('#loading').style.display = "none";
}


function diplayData(data, data2) {
    let html = `
    <div class="country text-center flex items-center justify-center pt-10">
        <h1 id="country" class="text-4xl pt-0">${data.results[0].components.country}</h1>
        <p class="ml-8">${data2.sys.country}</p>
    </div>
    <div class="city-weather flex justify-evenly items-center ">
        <div class="left relative w-[37%]"> 
            <img src="img/rainy-1.svg" alt="" class="w-full h-full">
            <p id="description" class="text-xl absolute bottom-4 left-6">${(data2.weather[0].description).toUpperCase()}</p>
        </div>
        <div class="right city text-end">
            <p>${data.results[0].components.village}</p>
            <h1 id="name" class="text-2xl font-bold">${data2.name}</h1>
            <p class="text-6xl">${Math.round(data2.main.temp)} °C</p>
            <p id="humidity" class="text-xl">Nem <i class="fa-solid fa-droplet"></i> : % ${data2.main.humidity}</p>
            <p id="speed" class="text-xl">Rüzgar <i class="fa-solid fa-wind"></i> : ${data2.wind.speed} km/s</p>
        </div>
    </div>
    <div class="card-footer text-center pt-10">
        <p class="font-outfit text-xl italic px-1"></p>
    </div>
    `;

    document.querySelector('.card-body').innerHTML = html;

    if(data2.weather[0].main == "Clouds") {
        document.querySelector('.left img').src = "./img/cloudy-day-3.svg";
        document.querySelector('.card-footer p').innerHTML = "Hava biraz bulutlu fakat biraz gezinti için engel değil :)";
    }
    else if(data2.weather[0].main == "Clear") {
        document.querySelector('.left img').src = "./img/day.svg";
        document.querySelector('.card-footer p').innerHTML = "Bugün güneş sizin için doğmuş olabilir, dışarı çıkın ve onu selamlayın :)";

    }
    else if(data2.weather[0].main == "Rain") {
        document.querySelector('.left img').src = "./img/rainy-3.svg";
        document.querySelector('.card-footer p').innerHTML = "Yağmurda ıslanmayı sevmiyorsanız, şemsiye veya yağmurluk kullanmayı unutmayınız. :)";

    }
    else if(data2.weather[0].main == "Drizzle") {
        document.querySelector('.left img').src = "./img/rainy-5.svg";
        document.querySelector('.card-footer p').innerHTML = "Biraz yağmur, biraz kahve ve bolca huzur.  :)";

    }
    else if(data2.weather[0].main == "Mist") {
        document.querySelector('.left img').src = "./img/cloudy.svg";
        document.querySelector('.card-footer p').innerHTML = "Sisli hava çabuk hasta eder, dikkatli olalım. :)";

    }
    else if(data2.weather[0].main == "Snow") {
        document.querySelector('.left img').src = "./img/snowy-1.svg"
        document.querySelector('.card-footer p').innerHTML = "Bugün kar yağışı görünüyor, sıkı giyinelim. :)";

    }

    
};
 

const setQuery = (e) => {
    if(e.keyCode == "13") {
        getResult(searchInput.value);
        document.querySelector('#loading').style.display = "block";
    }
}
        
        

const getResult = (cityName) => {
    let api_keyW = "5727d65de647401676e1f8594f7d5446";
    let urlW = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_keyW}&lang=tr&units=metric`;
  
    fetch(urlW)
      .then((weather) => {
        if (weather.ok) {
          return weather.json();
        } else {
          throw new Error('Ülke veya şehir bulunamadı. :(');
        } 
      })
      .then(displayResult)
      .catch((error) => {
        renderError(error)
      });
  };
  

const displayResult = (result) => {

    document.querySelector('#loading').style.display = "none";
    let city = `
    <div class="country text-center flex items-center justify-center pt-8">
    <h1 id="country" class="text-4xl pt-0">${result.name}</h1>
    <p class="ml-8">${result.sys.country}</p>
</div>
<div class="city-weather flex justify-evenly items-center ">
    <div class="left relative w-[37%]"> 
        <img src="" alt="" class="w-full h-full">
        <p id="description" class="text-xl absolute bottom-3 left-6">${result.weather[0].description.toUpperCase()}</p>
    </div>
    <div class="right city text-end">
        <p>${result.name}</p>
        <h1 id="name" class="text-2xl font-bold">${result.name}</h1>
        <p class="text-6xl">${Math.round(result.main.temp)} °C</p>
        <p id="humidity" class="text-xl">Nem <i class="fa-solid fa-droplet"></i> : % ${result.main.humidity}</p>
        <p id="speed" class="text-xl">Rüzgar <i class="fa-solid fa-wind"></i> : ${result.wind.speed} km/s</p>
    </div>
</div>
<div class="card-footer text-center pt-10">
    <p class="font-outfit text-xl italic px-1"></p>
</div>
    `;

    document.querySelector('.card-body').innerHTML = city;

    if(result.weather[0].main == "Clouds") {
        document.querySelector('.left img').src = "./img/cloudy-day-3.svg"
        document.querySelector('.card-footer p').innerHTML = "Hava biraz bulutlu fakat biraz gezinti için engel değil :)";

    }
    else if(result.weather[0].main == "Clear") {
        document.querySelector('.left img').src = "./img/day.svg"
        document.querySelector('.card-footer p').innerHTML = "Bugün güneş sizin için doğmuş olabilir, dışarı çıkın ve onu selamlayın :)";

    }
    else if(result.weather[0].main == "Rain") {
        document.querySelector('.left img').src = "./img/rainy-3.svg"
        document.querySelector('.card-footer p').innerHTML = "Yağmurda ıslanmayı sevmiyorsanız, şemsiye veya yağmurluk kullanmayı unutmayınız. :)";

    }
    else if(result.weather[0].main == "Drizzle") {
        document.querySelector('.left img').src = "./img/rainy-5.svg"
        document.querySelector('.card-footer p').innerHTML = "Biraz yağmur, biraz kahve ve bolca huzur.  :)";

    }
    else if(result.weather[0].main == "Mist") {
        document.querySelector('.left img').src = "./img/cloudy.svg"
        document.querySelector('.card-footer p').innerHTML = "Sisli hava çabuk hasta eder, dikkatli olalım. :)";

    }
    else if(result.weather[0].main == "Snow") {
        document.querySelector('.left img').src = "./img/snowy-1.svg"
        document.querySelector('.card-footer p').innerHTML = "Bugün kar yağışı görünüyor, sıkı giyinelim. :)";

    }
    else if(result.weather[0].main == "Haze") {
        document.querySelector('.left img').src = "./img/cloudy.svg"
        document.querySelector('.card-footer p').innerHTML = "Bugün hava biraz sisli görünüyor, dikkatli olalım. :)";

    }

   

}

const searchInput = document.querySelector('#searchInput');
searchInput.addEventListener('keypress', setQuery);
searchBtn.addEventListener('click', () => {
    getResult(searchInput.value);
    
})



function renderError(err) {
    document.querySelector('.card-body').innerHTML = "";

    document.querySelector('#loading').style.display = "none";
    const html = `
        <div class="text-xl" style="color: #B70404;">
            ${err.message}
        </div>
    `;

    document.querySelector("#error").innerHTML = html;

    setTimeout(function() {
        document.querySelector("#error").innerHTML = "";
    }, 3000);
}