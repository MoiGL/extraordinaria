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
    this.hitos.forEach((hito, index) => {
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
    this.hitos.forEach((hito) => {
      kml += '          ' + hito.longitud + ',' + hito.latitud + '\n';
    });
    kml += '        </coordinates>\n';
    kml += '      </LineString>\n';
    kml += '    </Placemark>\n';

    kml += '  </Document>\n';
    kml += '</kml>';

    return kml;
  }
}

class RutasApp {
  constructor(rutas) {
    this.rutas = rutas;
  }

  descargarRutas() {
    if (this.rutas && this.rutas.length > 0) {
      this.rutas.forEach((ruta, index) => {
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


class Mapa {
  constructor(ruta) {
    this.ruta = ruta;
    this.section = document.createElement('section');

    let heading = document.createElement('h3');
    heading.textContent = 'Mapa de la ruta: ' + this.ruta.nombre;

    this.mapImage = document.createElement('img');
    this.mapImage.alt = 'Mapa de la ruta ' + this.ruta.nombre;

    this.section.appendChild(heading);
    this.section.appendChild(this.mapImage);

    let main = document.querySelector('main');
    main.appendChild(this.section);

    this.loadStaticMap();
  }

  loadStaticMap() {
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap?';
    const size = '600x400'; // Tamaño del mapa
    const apiKey = 'AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU'; // Reemplaza esto con tu clave de API de Google Maps

    // Generar los marcadores y el camino
    const markers = this.ruta.hitos.map((hito, index) => 
      `markers=label:${index + 1}%7C${hito.latitud},${hito.longitud}`
    ).join('&');
    
    const path = 'path=color:0xff0000ff|weight:2|' + this.ruta.hitos.map(hito =>
      `${hito.latitud},${hito.longitud}`
    ).join('|');
    
    const mapUrl = `${baseUrl}size=${size}&${path}&${markers}&key=${apiKey}`;

    this.mapImage.src = mapUrl;
  }
}


class InterfazUsuario {
  constructor() {
    this.fileInput = document.querySelector("input[type=file]");
    this.boton = document.querySelector('button');
    this.inicializar();
  }

  inicializar() {
    this.boton.style.display = 'none';
    this.fileInput.addEventListener('change', (event) => this.cargarArchivo(event));
    this.boton.addEventListener('click', () => this.descargarRutas());
  }

  cargarArchivo(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const rutas = [];
    reader.onload = (e) => {
      this.boton.style.display = 'block';
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
        rutaHTML += "</ul><article>";

        // Mostrar las fotografías de la ruta
        $(this).find('hito').each(function () {
          var hitoFotografias = $(this).find('galeria_fotos').find('fotografia');
          hitoFotografias.each(function (index) {
            var fotografiaURL = $(this).attr('url');
            var textoAlternativo = "Fotografía " + (index + 1);
            rutaHTML += "<img src='multimedia/img/" + fotografiaURL + "' alt='" + textoAlternativo + "'>";
          });
        });
        rutaHTML += "</article></section>";
        rutas.push(ruta);
        $('main').append(rutaHTML);

        // Crear un mapa para esta ruta
        new Mapa(ruta);
      });

      this.rutasApp = new RutasApp(rutas);
    };
    reader.readAsText(file);
  }

  descargarRutas() {
    if (this.rutasApp) {
      this.rutasApp.descargarRutas();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new InterfazUsuario();
});

