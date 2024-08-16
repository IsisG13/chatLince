let isActive = true; // Estado do botão  

window.addEventListener("message", function(event) {  
    if (event.origin !== window.location.origin) {  
        return; // Ignora mensagens de outras origens  
    }  
    if (event.data.phone) {  
        document.getElementById('content').innerText = `Recebi como parâmetro o telefone: ${event.data.phone}`;  
    }  
});  

document.getElementById('toggle-button').addEventListener('click', () => {  
    isActive = !isActive;  
    document.getElementById('toggle-button').innerText = isActive ? "Desativar" : "Ativar";  
    // Aqui você pode fazer uma requisição para sua API para registrar a mudança de estado  
});