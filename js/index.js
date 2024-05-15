
class Carousel {
  constructor(images) {
    this.images = images;
    this.currentImage = 0;
    this.totalImages = images.length;
    this.imageElement = document.querySelector('figure img');
    this.imageElement.src = images[0];
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

const images = ['multimedia/img/1b.jpg', 'multimedia/img/2b.jpg', 'multimedia/img/3b.jpg', 'multimedia/img/4b.jpg', 'multimedia/img/5b.jpg'];
const carousel = new Carousel(images);
carousel.start();

// Definición de la clase para mostrar la información meteorológica
class Weather {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.lat = 41.3851;
    this.lon = 2.1734;
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


const apiKey = 'b4723839cff632ec277abce78c1c61f2';
const weather = new Weather(apiKey);

  weather.getForecast()
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


class Noticias {
  constructor() {
      this.apiKey = "880174242cbf4a64b66fa340d92f744a";
      this.apiUrl = "https://newsapi.org/v2/everything?q=barcelona&apiKey=" + this.apiKey;
      this.listaNoticias = document.createElement('ul'); // Crear el elemento <ul> en el constructor
      this.buscarNoticiasBtn = document.getElementById('buscarNoticias');
      this.contenedorNoticias = document.querySelector('body > main > section:nth-child(4)'); // Seleccionar el contenedor de noticias
      this.contenedorNoticias.appendChild(this.listaNoticias); // Agregar la lista de noticias al contenedor
  }

  init() {
      this.buscarNoticiasBtn.addEventListener('click', () => {
          this.getNoticias();
      });
  }

  async getNoticias() {
      try {
          const response = await fetch(this.apiUrl);
          if (!response.ok) {
              throw new Error('Error al obtener las noticias: ' + response.status);
          }
          const data = await response.json();

          this.listaNoticias.innerHTML = ''; // Limpiar la lista antes de agregar nuevas noticias
          for (let i = 0; i < 5; i++) {
              const titulo = data.articles[i].title;
              const descripcion = data.articles[i].summary;
              const url = data.articles[i].link;

              const li = document.createElement('li');
              const a = document.createElement('a');
              const h3 = document.createElement('h3');

              a.href = url;
              h3.textContent = titulo;

              a.appendChild(h3);
              li.appendChild(a);
              this.listaNoticias.appendChild(li);
          }
      } catch (error) {
          console.error('Se produjo un error al obtener las noticias:', error);
          const errorLi = document.createElement('li');
          errorLi.textContent = 'Se produjo un error al obtener las noticias: ' + error.message;
          this.listaNoticias.appendChild(errorLi);
      }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const noticias = new Noticias();
  noticias.init();
});




