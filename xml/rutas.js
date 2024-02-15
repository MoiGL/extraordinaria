class RutasApp {
  constructor(rutas) {
    this.rutas = rutas;
  }


  descargarRutas(rutas) {
    if (rutas !== null && rutas !== undefined && rutas.length !== 0) {
      rutas.forEach(function (ruta, index) {
        var kml = ruta.toKML();
        var kmlEncoded = encodeURIComponent(kml);
        var downloadLink = document.createElement('a');
        downloadLink.textContent = 'Descargar KML de la ruta ' + index;
        downloadLink.href = 'data:application/vnd.google-earth.kml+xml;charset=utf-8,' + kmlEncoded;
        downloadLink.download = 'ruta' + index + '.kml';
        downloadLink.click();
      });
    }
  }

}

class Ruta {
  constructor(nombre, inicioLongitud, inicioLatitud, descripcion) {
    this.nombre = nombre;
    this.inicioLongitud = inicioLongitud;
    this.inicioLatitud = inicioLatitud;
    this.descripcion = descripcion;
    this.hitos = [];
  }

  agregarHito(longitud, latitud) {
    this.hitos.push({ longitud, latitud });
  }

  toKML() {
    let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
    kml += '  <Document>\n';

    // Etiqueta KML para el punto de inicio de la ruta
    kml += '    <Placemark>\n';
    kml += '      <name>' + this.nombre + '</name>\n';
    kml += '      <Point>\n';
    kml += '        <coordinates>' + this.inicioLongitud + ',' + this.inicioLatitud + '</coordinates>\n';
    kml += '      </Point>\n';
    kml += '    </Placemark>\n';

    // Etiquetas KML para los hitos de la ruta
    this.hitos.forEach(function (hito, index) {
      kml += '    <Placemark>\n';
      kml += '      <name>Hito ' + (index + 1) + '</name>\n';
      kml += '      <Point>\n';
      kml += '        <coordinates>' + hito.longitud + ',' + hito.latitud + '</coordinates>\n';
      kml += '      </Point>\n';
      kml += '    </Placemark>\n';
    });

    // LineString para unir todos los hitos
    kml += '    <Placemark>\n';
    kml += '      <LineString>\n';
    kml += '        <coordinates>\n';
    this.hitos.forEach(function (hito) {
      kml += '          ' + hito.longitud + ',' + hito.latitud + '\n';
    });
    kml += '        </coordinates>\n';
    kml += '      </LineString>\n';
    kml += '    </Placemark>\n';

    kml += '  </Document>\n';
    kml += '</kml>';

    return kml;
  }


var rutasApp;

$(document).ready(function () {
  var boton = $('button');
  boton[0].style.display = 'none';
  const fileInput = document.querySelector("input[type=file]");
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const rutas = [];
    reader.onload = function (e) {
      var boton = $('button');
      boton[0].style.display = 'block';
      const xmlString = e.target.result;
      const xmlDoc = $.parseXML(xmlString);
      const $xml = $(xmlDoc);

      $xml.find('ruta').each(function () {
        var nombre = $(this).find('nombre').first().text();
        var inicioLongitud = $(this).find('inicio').find('coordenadas').attr('longitud');
        var inicioLatitud = $(this).find('inicio').find('coordenadas').attr('latitud');
        var descripcion = $(this).find('descripcion').text();
        var duracion = $(this).find('duracion').text();

        var rutaHTML = "<section><h2>" + nombre + "</h2>";
        rutaHTML += "<p><strong>Descripción:</strong> " + descripcion + "</p>";
        rutaHTML += "<p><strong>Duración:</strong> " + duracion + "</p>";

        var ruta = new Ruta(nombre, inicioLongitud, inicioLatitud, descripcion);
        // Mostrar los hitos de la ruta
        rutaHTML += "<p><strong>Hitos</strong></p>";
        rutaHTML += "<ul>";
        $(this).find('hito').each(function () {
          var hitoLongitud = $(this).find('coordenadas').attr('longitud');
          var hitoLatitud = $(this).find('coordenadas').attr('latitud');
          var hitoNombre = $(this).find('nombre').text();
          var hitoDescripcion = $(this).find('descripcion').text();

          rutaHTML += "<li>" + hitoNombre + "<br>";
          rutaHTML += hitoDescripcion + "</li>";
          ruta.agregarHito(hitoLongitud, hitoLatitud);
        });
        rutaHTML += "</ul>";

        // Mostrar las fotografías de la ruta
        $(this).find('hito').each(function () {
          var hitoFotografias = $(this).find('galeria_fotos').find('fotografia');
          hitoFotografias.each(function (index) {
            var fotografiaURL = $(this).attr('url');
            var textoAlternativo = "Fotografía " + (index + 1);
            rutaHTML += "<img src='multimedia/img/" + fotografiaURL + "' alt='" + textoAlternativo + "'>";
          });
        });
        rutaHTML += "</section>";
        rutas.push(ruta);
        $('main').append(rutaHTML);
      });

      rutasApp = new RutasApp(rutas);
     addPlanimetry(rutas);
    };
    reader.readAsText(file);
    boton[0].onclick = function () {
      rutasApp.descargarRutas(rutas);
    };
  });
});

function addPlanimetry(rutas) {
  // Cargar los archivos KML y mostrarlos en el mapa
  var map = L.map('map').setView([41.38987725936458, 2.1618626322033383], 6); // Coordenadas iniciales y nivel de zoom

  // Añadir una capa base de OpenStreetMap
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map); 

  if (rutas !== null && rutas !== undefined && rutas.length !== 0) {
    rutas.forEach(function (ruta) {
      var kmlContent = ruta.toKML();
      var kmlLayer = omnivore.kml.parse(kmlContent);
      kmlLayer.addTo(map);
    });
  }
}


