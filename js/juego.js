const preguntas = [
    {
        pregunta: '¿Cuál es el nombre del concejo?',
        respuestas: ['Barcelona', 'Oviedo', 'Gijón', 'Avilés', 'Gozón'],
        respuestaCorrecta: 1
    },
    {
        pregunta: '¿Qué tecnologías se usaron para desarrollar el proyecto?',
        respuestas: ['HTML y CSS', 'JavaScript', 'PHP', 'Todas las anteriores', 'Ninguna de las anteriores'],
        respuestaCorrecta: 4
    },
    {
        pregunta: '¿Donde está ubicado el concejo en Cataluña?',
        respuestas: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
        respuestaCorrecta: 4
    },
    {
        pregunta: '¿Cuántas noticias muestra la página principal?',
        respuestas: ['1', '2', '3', '4', '5'],
        respuestaCorrecta: 4
    },
    {
        pregunta: '¿Cuántas imágenes contiene el carrusel de la página principal?',
        respuestas: ['1', '2', '3', '4', '5'],
        respuestaCorrecta: 4
    },
    {
        pregunta: '¿Cuál de estos ingredientes de cachopo no son tipicos de Barcelona?',
        respuestas: ['alcachofas', 'jamon', 'setas', 'queso', 'marisco'],
        respuestaCorrecta: 1
    },
    {
        pregunta: '¿Cuántos dias de previsión tiene la sección meteorología de la página?',
        respuestas: ['2', '4', '5', '6', '7'],
        respuestaCorrecta: 5
    },
    {
        pregunta: '¿Cuál de estos postres son tipicos de Barcelona?',
        respuestas: ['Arroz con leche', 'Tarta de queso', 'Leche Frita', 'Todos los anteriores', 'Ninguno de los anteriores'],
        respuestaCorrecta: 4
    },
    {
        pregunta: '¿Cuál de estos ingredientes de fabada no son tipicos de Barcelona?',
        respuestas: ['Fabes de la granja', 'Compango', 'Chorizo asturiano', 'Morcilla asturiana', 'marisco'],
        respuestaCorrecta: 5
    },
    {
        pregunta: '¿Qué validaciones sigue el sitio web segun el W3C?',
        respuestas: ['HTML5 Válido', 'CSS Válido', 'Niguna', 'HTML5 y CSS válido', 'ISO 9023/34'],
        respuestaCorrecta: 3
    }
    // Agrega aquí las demás preguntas
];
let respuestasCorrectas = 0;

function validarRespuestas() {
    const respuestas = document.querySelectorAll('input[type="radio"]:checked');
    const totalPreguntas = preguntas.length;

    if (respuestas.length !== totalPreguntas) {
        alert('Debes responder todas las preguntas antes de enviar tus respuestas.');
        return false;
    }

    return true;
}

function generarPregunta(pregunta) {
    const preguntaHTML = document.createElement('div');

    const titulo = document.createElement('h3');
    titulo.textContent = pregunta.pregunta;
    preguntaHTML.appendChild(titulo);

    pregunta.respuestas.forEach((respuesta, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `pregunta-${preguntas.indexOf(pregunta)}`; // Asigna el mismo nombre de grupo para todas las respuestas de la misma pregunta
        input.value = index;

        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + respuesta + ' '));

        preguntaHTML.appendChild(label);
    });


    return preguntaHTML;
}

function validarRespuesta(pregunta, respuesta) {
    if (pregunta.respuestaCorrecta === respuesta) {
        respuestasCorrectas++;
    }
}

function ocultarResultado() {
    const contenedor = document.querySelector('body > main > section:nth-child(2)');
    contenedor.innerHTML = '';
}


function mostrarResultado() {
    if (validarRespuestas()) {
        const resultadoHTML = document.createElement('section');

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

        const contenedor = document.querySelector('body > main > section:nth-child(2)');
        contenedor.appendChild(resultadoHTML);
    }
}

function reiniciarTest() {
    respuestasCorrectas = 0;
    ocultarResultado();

}

function mostrarPreguntas() {
    const contenedor = document.querySelector('body > main > section:nth-child(1)');

    preguntas.forEach((pregunta, index) => {
        const preguntaHTML = generarPregunta(pregunta);
        contenedor.appendChild(preguntaHTML);

        const inputs = preguntaHTML.querySelectorAll('input');
        inputs.forEach((input) => {
            input.addEventListener('change', () => {
                validarRespuesta(pregunta, parseInt(input.value));
            });
        });
    });
    const boton = document.createElement('button');
    boton.textContent = 'Enviar respuestas';
    boton.addEventListener('click', mostrarResultado);
    contenedor.appendChild(boton)
}

mostrarPreguntas();


