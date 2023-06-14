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
    const coordenadasElements = xmlDoc.querySelectorAll("coordenadas");
    const altitudes = Array.from(coordenadasElements).map((element) =>
      parseFloat(element.getAttribute("altitud"))
    );
    return [altitudes];
  }

  extractAltitudesRuta(xmlDoc) {
    const rutaElements = xmlDoc.querySelectorAll("ruta");
    const altitudes = Array.from(rutaElements).map((rutaElement) => {
      const coordenadasElements = rutaElement.querySelectorAll("coordenadas");
      return Array.from(coordenadasElements).map((coordenadasElement) =>
        parseFloat(coordenadasElement.getAttribute("altitud"))
      );
    });
    return altitudes;
  }


  drawChart(altitudes) {
    if (!Array.isArray(altitudes) || altitudes.length === 0) {
      console.error("Las altitudes no son válidas");
      return;
    }
    const svg = d3.select("svg");
    const margin = { top: 10, right: 20, bottom: 30, left: 50 };
    const innerWidth = this.width - margin.left - margin.right;
    const innerHeight = this.height - margin.top - margin.bottom;

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(altitudes, (d) => d.length)])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(altitudes, (d) => d3.max(d))])
      .range([innerHeight, 0]);

    const line = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d));

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    altitudes.forEach((d) => {
      g.append("path")
        .datum(d)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);
    });

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
      .text("altura(m)")
      .style("fill", "black");

    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", this.width / 2)
      .attr("y", margin.top + 8)
      .text("Gráfico de altura");

      return svg;
  }

  render() {
    const fileInput = document.querySelector("input[type=file]");

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];

      this.parseXML(file)
        .then((xmlDoc) => {
          const altitudes = this.extractAltitudes(xmlDoc);
          this.drawChart(altitudes);

          /* const altitudes2 = this.extractAltitudesRuta(xmlDoc);
          const altitudesRuta1 = altitudes2[2];
          this.downloadChart(altitudesRuta1, 'svg2.svg'); */

        })
        .catch((error) => {
          console.error(error);
        });
    });


  }


  downloadChart(altitudes, filename) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", "400");
    svg.setAttribute("height", "300");
  
    const chartWidth = 300;
    const chartHeight = 200;
    const maxAltitude = Math.max(...altitudes);
    const scale = chartHeight / maxAltitude;
  
    for (let i = 0; i < altitudes.length; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", (i * 30).toString());
      rect.setAttribute("y", (chartHeight - altitudes[i] * scale).toString());
      rect.setAttribute("width", "20");
      rect.setAttribute("height", (altitudes[i] * scale).toString());
      rect.setAttribute("fill", "blue");
      svg.appendChild(rect);
  
      // Agregar el valor de altura en el eje y
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", (i * 30).toString());
      text.setAttribute("y", (chartHeight - altitudes[i] * scale - 5).toString());
      text.setAttribute("fill", "black");
      text.setAttribute("font-size", "12");
      text.textContent = altitudes[i].toString();
      svg.appendChild(text);
    }
  
    this.downloadSVG(svg.outerHTML, filename);
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
