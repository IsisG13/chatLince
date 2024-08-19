// IFRAME.JS

let isActive = true; // Estado inicial do botão

function updateContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get('phone');
    const message = urlParams.get('message');
    const content = document.getElementById('content');
    
    if (phone && message) {
        content.textContent = `Chat de ${phone} aberto. última mensagem dessa conversa foi: "${message}".`;
    } else if (phone) {
        content.textContent = `Cha de ${phone} aberto.`;
    } else {
        content.textContent = 'Nenhum chat aberto.';
    }
}

function toggleExtension() {
    isActive = !isActive;
    const button = document.getElementById('toggleButton');
    button.textContent = isActive ? 'ON' : 'OFF';
    
    // Enviar mensagem para o content script
    parent.postMessage({ type: 'toggle', active: isActive }, '*');
}


window.addEventListener('load', () => {
    updateContent();
    document.getElementById('toggleButton').addEventListener('click', toggleExtension);
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'update') {
        const phone = event.data.phone;
        const message = event.data.message;
        const content = document.getElementById('content');
        
        if (phone && message) {
            content.textContent = `Chat de ${phone} aberto. última mensagem dessa conversa foi: "${message}".`;
        } else if (phone) {
            content.textContent = `Cha de ${phone} aberto.`;
        } else {
            content.textContent = 'Nenhum chat aberto.';
        }
    }
});
