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

  drawChart(altitudes) {
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
  }

  render() {
    const fileInput = document.querySelector("input[type=file]");

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];

      this.parseXML(file)
        .then((xmlDoc) => {
          const altitudes = this.extractAltitudes(xmlDoc);
          this.drawChart(altitudes);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
}

// Crear instancia de la clase AltitudeChart y renderizar el gráfico
const chart = new AltitudeChart(null, 500, 300);
chart.render();
