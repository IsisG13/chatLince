// iframe.js

let isActive = true; // Estado inicial do bot

// Atualiza a interface do iframe com as informações fornecidas
function updateUI(data) {
    const statusIndicator = document.getElementById('status-indicator');
    const chatTitleElement = document.getElementById('chat-title');
    const lastMessageElement = document.getElementById('last-message');
    const toggleButton = document.getElementById('toggle-button');

    isActive = data.isActive;

    statusIndicator.textContent = isActive ? 'Bot ON' : 'Bot OFF';
    statusIndicator.style.color = isActive ? 'green' : 'red';

    chatTitleElement.textContent = data.chatTitle || '...';
    lastMessageElement.textContent = data.lastMessage || '...';

    toggleButton.textContent = isActive ? 'Bot OFF' : ' Bot ON';
}

// Envia uma mensagem para o content script para alterar o estado do bot
function toggleBot() {
    isActive = !isActive;
    window.parent.postMessage({ type: 'toggle', isActive: isActive }, '*');
}

// Listener para mensagens recebidas do content script
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'update') {
        updateUI(event.data);
    }
});

// Inicialização ao carregar o iframe
window.addEventListener('load', () => {
    const toggleButton = document.getElementById('toggle-button');
    toggleButton.addEventListener('click', toggleBot);
});
