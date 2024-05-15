const preguntas = [
    {
        pregunta: '¿Cuál es el nombre de la CCAA?',
        respuestas: ['Cataluña', 'Asturias', 'Extremadura', 'Murcia', 'Alicante'],
        respuestaCorrecta: 0
    },
    {
        pregunta: '¿Qué tecnologías se usaron para desarrollar el proyecto?',
        respuestas: ['HTML y CSS', 'JavaScript', 'PHP', 'Todas las anteriores', 'Ninguna de las anteriores'],
        respuestaCorrecta: 3
    },
    {
        pregunta: '¿En qué provincia está la capital de Cataluña?',
        respuestas: ['Gerona', 'Barcelona', 'Lerida', 'Tarragona', 'Ninguna de las anteriores'],
        respuestaCorrecta: 1
    },
    {
        pregunta: '¿Cuántas noticias muestra la página principal?',
        respuestas: ['1', '2', '3', '4', '5'],
        respuestaCorrecta: 3
    },
    {
        pregunta: '¿Cuántas imágenes contiene el carrusel de la página principal?',
        respuestas: ['1', '2', '3', '4', '5'],
        respuestaCorrecta: 3
    },
    {
        pregunta: '¿Cuál de estos ingredientes no es típico de Cataluña?',
        respuestas: ['Limón', 'Aceite de oliva', 'Berenjena', 'Pimiento', 'Cebolla'],
        respuestaCorrecta: 0
    },
    {
        pregunta: '¿Cuántos días de previsión tiene la sección meteorología de la página?',
        respuestas: ['2', '4', '5', '6', '7'],
        respuestaCorrecta: 4
    },
    {
        pregunta: '¿Cuál de estos postres es típico de Cataluña?',
        respuestas: ['Arroz con leche', 'Tarta de queso', 'Leche Frita', 'Mel I Mató', 'Ninguno de los anteriores'],
        respuestaCorrecta: 3
    },
    {
        pregunta: '¿Cuántas provincias tiene Cataluña?',
        respuestas: ['1', '2', '3', '4', '5'],
        respuestaCorrecta: 3
    },
    {
        pregunta: '¿Qué validaciones sigue el sitio web según el W3C?',
        respuestas: ['HTML5 Válido', 'CSS Válido', 'Ninguna', 'HTML5 y CSS válidos', 'ISO 9023/34'],
        respuestaCorrecta: 3
    }
];

let respuestasCorrectas = 0;

function validarRespuestas() {
    const respuestas = document.querySelectorAll('input[type="radio"]:checked');
    const totalPreguntas = preguntas.length;

    if (respuestas.length !== totalPreguntas) {
        alert('Debes responder todas las preguntas antes de enviar tus respuestas.');
        return false;
    }

    respuestasCorrectas = 0; // Resetear contador de respuestas correctas
    respuestas.forEach((respuesta) => {
        const [, preguntaIndex] = respuesta.name.split('-');
        const pregunta = preguntas[parseInt(preguntaIndex)];
        if (pregunta.respuestaCorrecta === parseInt(respuesta.value)) {
            respuestasCorrectas++;
        }
    });

    return true;
}
function generarPregunta(pregunta, index) {
    const preguntaHTML = document.createElement('div');

    const titulo = document.createElement('h3');
    titulo.textContent = pregunta.pregunta;
    preguntaHTML.appendChild(titulo);

    pregunta.respuestas.forEach((respuesta, i) => {
        const label = document.createElement('label');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `pregunta-${index}`;
        input.value = i;
        input.title = respuesta; // Añadir el atributo title con el texto de la respuesta

        label.appendChild(input);
        label.appendChild(document.createTextNode(respuesta));

        preguntaHTML.appendChild(label);
    });

    return preguntaHTML;
}

function ocultarResultado() {
    const contenedor = document.querySelector('body > main > section:nth-child(2)');    
    // Obtener el primer hijo del contenedor
    const primerHijo = contenedor.firstElementChild;
    // Eliminar todos los elementos hijos excepto el primer hijo
    let hijoActual = primerHijo.nextElementSibling;
    while (hijoActual) {
        const siguienteHijo = hijoActual.nextElementSibling;
        contenedor.removeChild(hijoActual);
        hijoActual = siguienteHijo;
    }
}


function mostrarResultado() {
    if (validarRespuestas()) {
        const main = document.querySelector('body > main');
        const contenedor = main.children[1]; // Asumiendo que es el segundo section en main
        let resultadoHTML = contenedor.querySelector('article');

        if (!resultadoHTML) {
            resultadoHTML = document.createElement('article');
            contenedor.appendChild(resultadoHTML);
        }

        resultadoHTML.innerHTML = ''; // Resetear contenido del contenedor de resultados
        const titulo = document.createElement('h3');
        titulo.textContent = 'Puntuación:';
        resultadoHTML.appendChild(titulo);

        const cantidadCorrectas = document.createElement('p');
        cantidadCorrectas.textContent = `Respuestas correctas: ${respuestasCorrectas}`;
        resultadoHTML.appendChild(cantidadCorrectas);

        const cantidadIncorrectas = document.createElement('p');
        cantidadIncorrectas.textContent = `Respuestas incorrectas: ${preguntas.length - respuestasCorrectas}`;
        resultadoHTML.appendChild(cantidadIncorrectas);

        const puntaje = document.createElement('p');
        puntaje.textContent = `Puntaje: ${respuestasCorrectas}/${preguntas.length}`;
        resultadoHTML.appendChild(puntaje);

        const boton = document.createElement('button');
        boton.textContent = 'Volver a intentar';
        boton.addEventListener('click', reiniciarTest);
        resultadoHTML.appendChild(boton);
    }
}

function reiniciarTest() {
    respuestasCorrectas = 0;
    ocultarResultado();
    mostrarPreguntas();
}

function mostrarPreguntas() {
    const contenedor = document.querySelector('body > main > section:nth-child(1)');
    contenedor.innerHTML = ''; // Limpia el contenedor antes de añadir nuevas preguntas

    preguntas.forEach((pregunta, index) => {
        const preguntaHTML = generarPregunta(pregunta, index);
        contenedor.appendChild(preguntaHTML);
    });

    const boton = document.createElement('button');
    boton.textContent = 'Enviar respuestas';
    boton.addEventListener('click', mostrarResultado);
    contenedor.appendChild(boton);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarPreguntas();
});
