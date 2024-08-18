function initMessageCapture() {
    console.log('Inicializando captura de mensagens...');

    // Função para capturar mensagens
    function captureMessages() {
        const messages = document.querySelectorAll('div.message-in, div.message-out');
        messages.forEach(message => {
            const authorElement = message.querySelector('span[data-testid="author"]');
            const messageElement = message.querySelector('div.copyable-text');

            if (messageElement && !messageElement.dataset.captured) {
                const author = authorElement ? authorElement.textContent.trim() : 'Você';
                const messageText = messageElement.textContent.trim();
                console.log(`${author}: ${messageText}`);
                messageElement.dataset.captured = 'true';
            }
        });
    }

    // Observar mudanças na página
    const observer = new MutationObserver((mutations) => {
        captureMessages();
    });

    // Configuração do observer
    const config = { childList: true, subtree: true };

    // Iniciar observação
    observer.observe(document.body, config);

    // Capturar mensagens existentes
    captureMessages();
}

// Executar a função quando a página estiver carregada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMessageCapture);
} else {
    initMessageCapture();
}
