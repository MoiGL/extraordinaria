
class Carousel {
  constructor(images) {
    this.images = images;
    this.currentImage = 0;
    this.totalImages = images.length;
    this.imageElement = document.querySelector('figure img');
    this.imageElement.src = images[0];
    /* this.prevButton.addEventListener('click', this.showPrev.bind(this));
    this.nextButton.addEventListener('click', this.showNext.bind(this)); */
  }

  showPrev() {
    this.currentImage--;
    if (this.currentImage < 0) {
      this.currentImage = this.totalImages - 1;
    }
    this.imageElement.src = this.images[this.currentImage];
  }

  showNext() {
    this.currentImage++;
    if (this.currentImage >= this.totalImages) {
      this.currentImage = 0;
    }
    this.imageElement.src = this.images[this.currentImage];
  }

  start() {
    setInterval(() => {
      this.showNext();
    }, 5000);
  }
}

const images = ['multimedia/img/1.jpg', 'multimedia/img/2.jpg', 'multimedia/img/3.jpg', 'multimedia/img/4.jpg', 'multimedia/img/5.jpg'];
const carousel = new Carousel(images);
carousel.start();

// Definición de la clase para mostrar la información meteorológica
class Weather {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.lat = null;
    this.lon = null;
  }

  // Método para obtener la ubicación del usuario mediante Geolocation API
  getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Método para obtener las previsiones meteorológicas
  getForecast() {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&lang=es&units=metric`;
    return fetch(url).then((response) => response.json());
  }
  
  renderCurrentWeather(currentWeather) {
    const weatherContainer = document.querySelector('body > main > section:nth-child(2) > section');
  
    const temperature = currentWeather.main.temp;
    const feelsLike = currentWeather.main.feels_like;
    const humidity = currentWeather.main.humidity;
    const windSpeed = currentWeather.wind.speed;
    const pressure = currentWeather.main.pressure;
    const visibility = currentWeather.visibility;
    const sunrise = new Date(currentWeather.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(currentWeather.sys.sunset * 1000).toLocaleTimeString();
    const description = currentWeather.weather[0].description;
    const icon = `http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;
  
    const currentWeatherElement = weatherContainer;
  
    const temperatureElement = document.createElement('p');
    temperatureElement.textContent = `Temperature: ${temperature}°C`;
    currentWeatherElement.appendChild(temperatureElement);
  
    const feelsLikeElement = document.createElement('p');
    feelsLikeElement.textContent = `Feels like: ${feelsLike}°C`;
    currentWeatherElement.appendChild(feelsLikeElement);
  
    const humidityElement = document.createElement('p');
    humidityElement.textContent = `Humidity: ${humidity}%`;
    currentWeatherElement.appendChild(humidityElement);
  
    const windSpeedElement = document.createElement('p');
    windSpeedElement.textContent = `Wind speed: ${windSpeed} km/h`;
    currentWeatherElement.appendChild(windSpeedElement);
  
    const pressureElement = document.createElement('p');
    pressureElement.textContent = `Pressure: ${pressure} hPa`;
    currentWeatherElement.appendChild(pressureElement);
  
    const visibilityElement = document.createElement('p');
    visibilityElement.textContent = `Visibility: ${visibility / 1000} km`;
    currentWeatherElement.appendChild(visibilityElement);
  
    const sunriseElement = document.createElement('p');
    sunriseElement.textContent = `Sunrise: ${sunrise}`;
    currentWeatherElement.appendChild(sunriseElement);
  
    const sunsetElement = document.createElement('p');
    sunsetElement.textContent = `Sunset: ${sunset}`;
    currentWeatherElement.appendChild(sunsetElement);
  
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;
    currentWeatherElement.appendChild(descriptionElement);
  
    const iconElement = document.createElement('img');
    iconElement.src = icon;
    iconElement.alt = description;
    currentWeatherElement.appendChild(iconElement);
  
    weatherContainer.appendChild(currentWeatherElement);
  }
  
}

// Crear el objeto carrusel y iniciar el carrusel
const apiKey = 'b4723839cff632ec277abce78c1c61f2';
const weather = new Weather(apiKey);

weather.getLocation()
  .then(() => {
    return weather.getForecast();
  })
  .then((forecast) => {
    weather.renderCurrentWeather(forecast);
  })
  .catch((error) => {
    console.error(error);
  });





const fechaActualizacion = new Date();
const elementoFecha = document.createElement('p');
elementoFecha.textContent = `Última actualización: ${fechaActualizacion.toLocaleString()}`;
document.body.appendChild(elementoFecha);



//Noticias
class Noticias {
  constructor() {
    this.apiKey = "zZ_oUy2-I5INUkkp_YNP8GC-HsdEyf3f0yKiJu5wXRc";
    this.apiUrl = "https://api.newscatcherapi.com/v2/search";
    this.listaNoticias = document.querySelector('body > main > section:nth-child(4) > ul');
  }

  init() {
    this.getNoticias();
  }

  async getNoticias() {
    const response = await fetch(`${this.apiUrl}?q=Asturias&lang=es&sort_by=relevancy`, {
      headers: {
        "x-api-key": this.apiKey
      }
    });
    const data = await response.json();

    for (let i = 0; i < 5; i++) {
      const titulo = data.articles[i].title;
      const descripcion = data.articles[i].summary;
      const url = data.articles[i].link;

      const li = document.createElement('li');
      const a = document.createElement('a');
      const h3 = document.createElement('h3');
      const p = document.createElement('p');

      a.href = url;
      h3.textContent = titulo;
      p.textContent = descripcion;

      a.appendChild(h3);
      a.appendChild(p);
      li.appendChild(a);
      this.listaNoticias.appendChild(li);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const noticias = new Noticias();
  noticias.init();
});

