// API Key para OpenWeatherMap
const apiKey = 'b4723839cff632ec277abce78c1c61f2';

// Obtener la ubicación del usuario mediante Geolocation API
navigator.geolocation.getCurrentPosition((position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Construir la URL de la API para obtener las previsiones meteorológicas
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,current&appid=${apiKey}&lang=es&units=metric`;

  // Hacer una solicitud GET a la API
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Obtener las previsiones para los próximos 7 días
      const forecast = data.daily.slice(0, 7);



      // Crear el elemento contenedor
      const forecastContainer = document.createElement('section');
      const titulo = document.createElement('h2');
      titulo.textContent = 'Últimos 7 días:';
      forecastContainer.appendChild(titulo);
      // Agregar los elementos de pronóstico meteorológico al contenedor
      forecast.forEach((day) => {
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

      // Agregar el contenedor al DOM
      document.body.appendChild(forecastContainer);

    });
})

