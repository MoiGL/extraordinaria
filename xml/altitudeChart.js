class AltitudeChart {
  constructor(xmlFile, width, height) {
    this.xmlFile = xmlFile;
    this.width = width;
    this.height = height;
  }

  parseXML(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const xmlString = event.target.result;
        const xmlDoc = $.parseXML(xmlString);
        resolve(xmlDoc);
      };
      reader.onerror = function (event) {
        reject(`Error reading XML file: ${event.target.error}`);
      };
      reader.readAsText(file);
    });
  }


  extractAltitudes(xmlDoc) {
    // Encuentra todos los elementos de ruta en el documento XML
    const rutaElements = xmlDoc.querySelectorAll("ruta");
    const rutas = Array.from(rutaElements).map((rutaElement) => {
        // Encuentra todos los elementos de coordenadas dentro de cada ruta
        const coordenadasElements = rutaElement.querySelectorAll("coordenadas");
        // Extrae las altitudes y retorna un array de altitudes
        const altitudes = Array.from(coordenadasElements).map((element) =>
            parseFloat(element.getAttribute("altitud"))
        );
        return altitudes;
    });
    return rutas; // Devuelve un array de arrays, uno para cada ruta
}

drawChart(rutas) {
  if (!Array.isArray(rutas) || rutas.length === 0) {
      console.error("No hay rutas válidas");
      return;
  }

  const svg = d3.select("svg");
  const margin = { top: 10, right: 20, bottom: 30, left: 50 };
  const innerWidth = this.width - margin.left - margin.right;
  const innerHeight = this.height - margin.top - margin.bottom;

  // Crear escalas
  const x = d3.scaleLinear()
      .domain([0, d3.max(rutas, ruta => ruta.length)]) // Longitud máxima de las rutas
      .range([0, innerWidth]);

  const y = d3.scaleLinear()
      .domain([0, d3.max(rutas, ruta => d3.max(ruta))]) // Altura máxima
      .range([innerHeight, 0]);

  // Crear generador de línea
  const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d));

  const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Dibuja una línea por cada ruta
  rutas.forEach((ruta, index) => {
      const color = index === 0 ? "steelblue" : `hsl(${index * 30}, 100%, 50%)`; // Color basado en el índice

      g.append("path")
          .datum(ruta)
          .attr("fill", "none")
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("d", line);
      
      // Añade entrada a la leyenda
      g.append("text")
          .attr("class", "legend")
          .attr("x", innerWidth + 10)
          .attr("y", margin.top + (index * 20))
          .text(`Ruta ${index + 1}`)
          .style("fill", color);
  });

  // Configurar ejes
  g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", 25)
      .text("Hitos")
      .style("fill", "black");

  g.append("g")
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .append("text")
      .attr("class", "axis-label")
      .attr("x", -innerHeight / 2)
      .attr("y", -35)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Altura (m)")
      .style("fill", "black");

  /* // Añade el título del gráfico
  svg.append("text")
      .attr("class", "chart-title")
      .attr("x", this.width / 2)
      .attr("y", margin.top + 8)
      .text("Gráfico de altimetría"); */

  return svg;
}


render() {
    const fileInput = document.querySelector("input[type=file]");

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];

        this.parseXML(file)
            .then(xmlDoc => {
                const rutas = this.extractAltitudes(xmlDoc);
                this.drawChart(rutas);
            })
            .catch(error => {
                console.error(error);
            });
    });
}


  
  downloadSVG(svgContent, filename) {
    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.setAttribute("href", "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent));
    link.setAttribute("download", filename);
  
    // Simular clic en el enlace para descargar el archivo
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Crear instancia de la clase AltitudeChart y renderizar el gráfico
const chart = new AltitudeChart(null, 500, 300);
chart.render();
