let isActive = true; // Estado inicial do botão

function updateContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get('phone');
    const message = urlParams.get('message');
    const content = document.getElementById('content');
    
    if (phone && message) {
        content.textContent = `${phone} enviou uma mensagem: "${message}".`;
    } else if (phone) {
        content.textContent = `${phone} enviou uma mensagem para você.`;
    } else {
        content.textContent = 'Nenhum número de telefone recebido.';
    }
}


function toggleExtension() {
    isActive = !isActive;
    const button = document.getElementById('toggleButton');
    button.textContent = isActive ? 'ON' : 'OFF';
    
    // Enviar mensagem para o content script
    window.postMessage({ type: 'toggle', active: isActive }, '*');
}

window.addEventListener('load', () => {
    updateContent();
    document.getElementById('toggleButton').addEventListener('click', toggleExtension);
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'update') {
        updateContent();
    }
});
