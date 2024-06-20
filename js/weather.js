class WeatherForecast {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';
    this.language = 'es';
    this.units = 'metric';
  }

  async getWeatherForecast(lat, lon) {
    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current&appid=${this.apiKey}&lang=${this.language}&units=${this.units}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.daily.slice(0, 7);
  }

  displayForecast(forecast) {
    const forecastContainer = document.querySelector('main');
    
    forecast.forEach(day => {
      const date = new Date(day.dt * 1000).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      const temp = day.temp.max.toFixed(0);
      const icon = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;
      const description = day.weather[0].description;

      const forecastItem = document.createElement('article');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `<h3>${date}</h3>
                            <p><img src="${icon}" alt="${description}"></p>
                            <p>${description}</p>
                            <p><strong>${temp}&deg;C</strong></p>`;

      forecastContainer.appendChild(forecastItem);
    });

    document.body.appendChild(forecastContainer);
  }
}

// Coordenadas de Barcelona
const barcelonaLat = 41.3851;
const barcelonaLon = 2.1734;
const apiKey = 'b4723839cff632ec277abce78c1c61f2';

const weatherForecast = new WeatherForecast(apiKey);
weatherForecast.getWeatherForecast(barcelonaLat, barcelonaLon)
  .then(forecast => weatherForecast.displayForecast(forecast))
  .catch(error => console.error('Error:', error));
