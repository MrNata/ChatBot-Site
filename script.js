const API_KEY = 'AIzaSyBqeDroMvVpAC92MjBGltGlSu50z0quTJs'; 

async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userText = inputField.value.trim();

    if (userText === '') return;

    // Mostra a mensagem do usuário
    chatBox.innerHTML += `<div class="message user">${userText}</div>`;
    inputField.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Mostra que o bot está "digitando"
    const typingId = "typing-" + Date.now();
    chatBox.innerHTML += `<div class="message bot" id="${typingId}">Pensando...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]
            })
        });

        const data = await response.json();
        
        // Verifica se a API retornou algum erro
        if (!response.ok) {
            console.error("Detalhes do Erro do Google:", data);
            throw new Error(data.error?.message || `Erro ${response.status} na API`);
        }
        
        // Se deu tudo certo, pega a resposta do bot
        const botReply = data.candidates[0].content.parts[0].text;
        document.getElementById(typingId).innerText = botReply;

    } catch (error) {
        document.getElementById(typingId).innerText = "Erro: " + error.message;
    }
}

// Permite enviar a mensagem apertando a tecla Enter
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});