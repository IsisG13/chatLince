function updateContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get('phone');
    const content = document.getElementById('content');
    
    if (phone) {
      content.textContent = `${phone} enviou uma mensagem para você.`;
    } else {
      content.textContent = 'Nenhum número de telefone recebido.';
    }
  }

  window.addEventListener('load', updateContent);
  window.addEventListener('message', (event) => {
    if (event.data === 'update') {
      updateContent();
    }
  });