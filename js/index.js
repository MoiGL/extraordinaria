

class Carousel {
  constructor() {
    this.images = [
      { desktop: 'multimedia/img/1b.jpg', mobile: 'multimedia/img/1b-movil.jpg' },
      { desktop: 'multimedia/img/2b.jpg', mobile: 'multimedia/img/2b-movil.jpg' },
      { desktop: 'multimedia/img/3b.jpg', mobile: 'multimedia/img/3b-movil.jpg' },
      { desktop: 'multimedia/img/4b.jpg', mobile: 'multimedia/img/4b-movil.jpg' },
      { desktop: 'multimedia/img/5b.jpg', mobile: 'multimedia/img/5b-movil.jpg' }
    ];
    this.currentImage = 0;
    this.totalImages = this.images.length;
    this.pictureElement = document.querySelector('body > main > section:nth-child(1) > picture');
    this.imgElement = this.pictureElement.querySelector('img');
    this.sourceElements = this.pictureElement.querySelectorAll('source');
    this.updateImage();
  }

  updateImage() {
    const current = this.images[this.currentImage];
    this.sourceElements[0].srcset = current.mobile;
    this.sourceElements[1].srcset = current.desktop;
    this.imgElement.src = current.desktop;
  }

 /*  showPrev() {
    this.currentImage--;
    if (this.currentImage < 0) {
      this.currentImage = this.totalImages - 1;
    }
    this.updateImage();
  }
*/
  showNext() {
    this.currentImage++;
    if (this.currentImage >= this.totalImages) {
      this.currentImage = 0;
    }
    this.updateImage();
  } 

  start() {
    setInterval(() => {
      this.showNext();
    }, 5000);
  }

}

const carousel = new Carousel();
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
    const weatherContainer = document.querySelector('body > main > section:nth-child(2)');

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




  class ActualizadorFecha {
    constructor() {
        this.fechaActualizacion = new Date();
    }

    actualizarFecha() {
      let elementoFecha = document.querySelector('body > p:nth-child(5)')
      if(!elementoFecha){
        elementoFecha = document.createElement('p');
        elementoFecha.textContent = `Última actualización: ${this.fechaActualizacion.toLocaleString()}`;
      }
      else {
        this.fechaActualizacion = new Date();
        elementoFecha.textContent = `Última actualización: ${this.fechaActualizacion.toLocaleString()}`;
      }
     
      document.body.appendChild(elementoFecha);
    }
}

// Uso de la clase:
const actualizador = new ActualizadorFecha();
actualizador.actualizarFecha();



class MapaEstaticoGoogle {
    constructor (){
      this.latitud = 41.3851;
      this.longitud = 2.1734;
    }
    
    getLongitud(){
        return this.longitud;
    }
    getLatitud(){
        return this.latitud;
    }

    getMapaEstaticoGoogle(){
        var ubicacion=document.querySelector('body > main > section:nth-child(3)');
        
        var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        //URL: obligatoriamente https
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        //Parámetros
        // centro del mapa (obligatorio si no hay marcadores)
        var centro = "center=" + this.latitud + "," + this.longitud;
        //zoom (obligatorio si no hay marcadores)
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom ="&zoom=8";
        //Tamaño del mapa en pixeles (obligatorio)
        var tamaño= "&size=800x600";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        var img = document.createElement('img');
        img.src = this.imagenMapa;
        img.alt = 'Mapa estático google';
        ubicacion.appendChild(img);
    }
}
var miMapa = new MapaEstaticoGoogle().getMapaEstaticoGoogle();






class Noticias {
  constructor() {
    this.apiKey = "880174242cbf4a64b66fa340d92f744a";
    this.apiUrl = "https://newsapi.org/v2/everything?q=barcelona&apiKey=" + this.apiKey;
    this.listaNoticias = document.createElement('ul'); // Crear el elemento <ul> en el constructor
    this.buscarNoticiasBtn = document.querySelector('body > main > section:nth-child(4) > button');
    this.contenedorNoticias = document.querySelector('body > main > section:nth-child(4)'); // Seleccionar el contenedor de noticias
    this.contenedorNoticias.appendChild(this.listaNoticias); // Agregar la lista de noticias al contenedor
  }

  init() {
    this.buscarNoticiasBtn.addEventListener('click', () => {
      this.getNoticias();
      actualizador.actualizarFecha();
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
        const url = data.articles[i].url;

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




