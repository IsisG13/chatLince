// Função para monitorar mensagens
const monitorMessages = () => {
    console.log("Monitorando mensagens...");
  
    // Seleciona o elemento principal onde as mensagens são exibidas
    const chatContainer = document.querySelector("div[role='x1n2onr6 _ak9y']");
  
    // Verifica se o chatContainer está disponível
    if (!chatContainer) {
      console.error("Container de chat não encontrado.");
      return;
    }
  
    // Cria um MutationObserver para observar mudanças no DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            // Verifica se o nó adicionado é uma mensagem
            if (node.nodeType === 1 && node.matches("div[role='row']")) {
              const messageText = node.querySelector("span.selectable-text");
              if (messageText) {
                console.log("Nova mensagem recebida:", messageText.innerText);
              }
            }
          });
        }
      });
    });
  
    // Inicia a observação
    observer.observe(chatContainer, {
      childList: true,
      subtree: true
    });
  
    console.log("Monitoramento iniciado.");
  };
  
  // Aguarda o carregamento do WhatsApp Web
  window.addEventListener('load', () => {
    console.log("WhatsApp Web carregado. Iniciando monitoramento...");
    monitorMessages();
  });