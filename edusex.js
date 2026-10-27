"use strict";

// ==========================================
// 1. MITOS Y REALIDADES
// ==========================================

document.querySelectorAll("[data-mito]").forEach(function(boton) {
    boton.addEventListener("click", function() {
        const numero = boton.dataset.mito;
        const respuesta = document.getElementById("realidad" + numero);

        if (!respuesta) return;

        const seAbrira = respuesta.hidden;
        respuesta.hidden = !seAbrira;
        boton.setAttribute("aria-expanded", String(seAbrira));

        boton.textContent = seAbrira
            ? "Ocultar realidad"
            : "Descubrir realidad";
    });
});


// ==========================================
// 2. GEOLOCALIZACIÓN
// ==========================================

const btnUbicacion = document.getElementById("btnUbicacion");
const estadoUbicacion = document.getElementById("estadoUbicacion");
const mapa = document.getElementById("mapa");

btnUbicacion.addEventListener("click", function() {
    if (!navigator.geolocation) {
        estadoUbicacion.textContent =
            "Tu navegador no admite la geolocalización. Busca manualmente en Google Maps.";
        return;
    }

    estadoUbicacion.textContent =
        "Solicitando permiso para consultar tu ubicación...";

    btnUbicacion.disabled = true;

    navigator.geolocation.getCurrentPosition(
        function(posicion) {
            const latitud = posicion.coords.latitude;
            const longitud = posicion.coords.longitude;

            estadoUbicacion.textContent =
                "Ubicación obtenida. Se mostrarán resultados de búsqueda cercanos.";

            // La ubicación se utiliza localmente para abrir una búsqueda.
            // No se guarda en una base de datos.
            const destino =
                "https://www.google.com/maps/search/centros+de+salud/@" +
                latitud + "," + longitud + ",14z";

            mapa.src =
                "https://maps.google.com/maps?q=" +
                latitud + "%2C" + longitud +
                "&z=14&output=embed";

            const enlace = document.createElement("a");
            enlace.href = destino;
            enlace.target = "_blank";
            enlace.rel = "noopener noreferrer";
            enlace.className = "boton";
            enlace.textContent = "Buscar centros de salud cercanos";

            estadoUbicacion.appendChild(document.createElement("br"));
            estadoUbicacion.appendChild(enlace);

            btnUbicacion.disabled = false;
        },
        function(error) {
            if (error.code === 1) {
                estadoUbicacion.textContent =
                    "No se concedió el permiso. Puedes usar la búsqueda manual de Google Maps.";
            } else if (error.code === 3) {
                estadoUbicacion.textContent =
                    "La solicitud tardó demasiado. Comprueba tu conexión e inténtalo otra vez.";
            } else {
                estadoUbicacion.textContent =
                    "No fue posible obtener tu ubicación. Comprueba los permisos del navegador.";
            }

            btnUbicacion.disabled = false;
        },
        {
            enableHighAccuracy: false,
            timeout: 12000,
            maximumAge: 60000
        }
    );
});


// ==========================================
// 3. CHATBOT EDUCATIVO AUTOMÁTICO
// ==========================================

const formChat = document.getElementById("formChat");
const preguntaChat = document.getElementById("preguntaChat");
const mensajes = document.getElementById("mensajes");
const btnLimpiarChat = document.getElementById("btnLimpiarChat");

function agregarMensaje(texto, tipo) {
    const burbuja = document.createElement("div");

    burbuja.className = "burbuja " + tipo;
    burbuja.textContent = texto;

    mensajes.appendChild(burbuja);
    mensajes.scrollTop = mensajes.scrollHeight;
}

function responderPregunta(texto) {
    const pregunta = texto.toLowerCase();

    const contiene = function(palabras) {
        return palabras.some(function(palabra) {
            return pregunta.includes(palabra);
        });
    };

    if (contiene(["suicid", "hacerme daño", "hacerme dano",
                  "no quiero vivir", "peligro inmediato"])) {
        return "Lamento que estés pasando por una situación difícil. Mereces apoyo. Si estás en peligro inmediato, llama al 911 en México o busca a una persona adulta de confianza que pueda acompañarte ahora.";
    }

    if (contiene(["violencia", "abuso", "obligan", "me obliga",
                  "me fuerza", "amenaza", "sin mi consentimiento"])) {
        return "Nadie debe presionarte ni obligarte a una situación sexual. Si no te sientes a salvo, busca apoyo de una persona adulta de confianza, personal de salud o servicios de protección. Si hay peligro inmediato en México, llama al 911.";
    }

    if (contiene(["embarazo", "embarazada", "retraso menstrual"])) {
        return "El embarazo puede ocurrir si los espermatozoides llegan al óvulo. Si crees que podrías estar embarazada, una prueba de embarazo y la orientación de personal de salud pueden ayudarte a conocer tus opciones. No tienes que afrontar tus dudas sin apoyo.";
    }

    if (contiene(["anticonceptivo", "anticoncepción", "anticoncepcion",
                  "condón", "condon", "preservativo", "implante",
                  "pastillas anticonceptivas"])) {
        return "Existen distintos métodos anticonceptivos, como condones, pastillas e implantes. No todos protegen contra las ITS; el condón ayuda a reducir ese riesgo. Un profesional de salud puede explicarte su uso, eficacia y posibles efectos.";
    }

    if (contiene(["emergencia", "pastilla del día", "pastilla del dia",
                  "se rompió el condón", "se rompio el condon",
                  "sin protección", "sin proteccion"])) {
        return "Si hubo una relación sin protección o falló un método, busca orientación médica o farmacéutica cuanto antes sobre anticoncepción de emergencia: algunas opciones tienen un límite de tiempo. Si existe riesgo de ITS, consulta también sobre pruebas y prevención.";
    }

    if (contiene(["its", "infección", "infeccion", "vih",
                  "sífilis", "sifilis", "clamidia"])) {
        return "Las infecciones de transmisión sexual pueden no causar síntomas. El condón reduce el riesgo de muchas ITS, y las pruebas permiten detectar infecciones. Acude a un servicio de salud para recibir orientación confidencial.";
    }

    if (contiene(["consentimiento", "decir no", "límites", "limites",
                  "presión", "presion"])) {
        return "El consentimiento es una aceptación libre, informada y sin presión. Puedes decir que no o cambiar de opinión en cualquier momento. Nadie tiene derecho a obligarte.";
    }

    if (contiene(["hola", "buenas", "buenos días", "buenos dias"])) {
        return "¡Hola! Bienvenido/a a EducSex. Puedes preguntarme sobre embarazo, anticoncepción, ITS, consentimiento o servicios de salud.";
    }

    if (contiene(["salud", "doctor", "doctora", "centro de salud",
                  "médico", "medico", "ayuda"])) {
        return "Puedes usar el módulo de centros de salud de esta página para buscar servicios cercanos. Confirma directamente los horarios y servicios disponibles. Si necesitas atención urgente en México, llama al 911.";
    }

    return "No tengo una respuesta específica para esa pregunta. Soy un chatbot educativo básico, no un profesional médico. Consulta el módulo de redes de apoyo o pide orientación a personal de salud. Por privacidad, no compartas tu nombre, domicilio ni otros datos personales.";
}

formChat.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const texto = preguntaChat.value.trim();

    if (!texto) return;

    agregarMensaje("Tú: " + texto, "usuario");
    agregarMensaje("EducSex: " + responderPregunta(texto), "bot");

    preguntaChat.value = "";
    preguntaChat.focus();
});

function iniciarChat() {
    mensajes.replaceChildren();

    agregarMensaje(
        "¡Hola! Soy EducSex. Puedes hacer preguntas generales sobre prevención, anticoncepción, ITS y consentimiento. No compartas información personal.",
        "bot"
    );
}

btnLimpiarChat.addEventListener("click", iniciarChat);


// ==========================================
// 4. TEST DE CONOCIMIENTOS
// ==========================================

const formTest = document.getElementById("formTest");
const resultadoTest = document.getElementById("resultadoTest");

const respuestasCorrectas = {
    p1: "b",
    p2: "a",
    p3: "a",
    p4: "c",
    p5: "a"
};

formTest.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const respuestas = new FormData(formTest);
    let aciertos = 0;
    const total = Object.keys(respuestasCorrectas).length;

    Object.keys(respuestasCorrectas).forEach(function(pregunta) {
        if (respuestas.get(pregunta) === respuestasCorrectas[pregunta]) {
            aciertos++;
        }
    });

    const porcentaje = Math.round((aciertos / total) * 100);

    let mensaje;

    if (aciertos === total) {
        mensaje = "¡Excelente! Contestaste todas correctamente.";
    } else if (aciertos >= 3) {
        mensaje = "¡Buen trabajo! Repasa los módulos para reforzar lo aprendido.";
    } else {
        mensaje = "Continúa aprendiendo. Revisa los módulos y vuelve a intentarlo.";
    }

    resultadoTest.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent = "Tu resultado: " + aciertos + " de " + total;

    const puntuacion = document.createElement("p");
    puntuacion.textContent = "Calificación: " + porcentaje + "%";

    const comentario = document.createElement("p");
    comentario.textContent = mensaje;

    resultadoTest.append(titulo, puntuacion, comentario);
});

// Limpiar el resultado al reiniciar el test.
formTest.addEventListener("reset", function() {
    resultadoTest.replaceChildren();
});