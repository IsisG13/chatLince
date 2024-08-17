// Criação do quadrado branco  
const createTestBox = () => {  
    const testBox = document.createElement('div');  
    testBox.textContent = 'TESTE';  
    testBox.style.position = 'absolute';  
    testBox.style.top = '10px';  
    testBox.style.right = '10px';  
    testBox.style.width = '100px';  
    testBox.style.height = '50px';  
    testBox.style.backgroundColor = 'white';  
    testBox.style.border = '2px solid black';  
    testBox.style.display = 'flex';  
    testBox.style.alignItems = 'center';  
    testBox.style.justifyContent = 'center';  
    testBox.style.zIndex = '9999';  
    document.body.appendChild(testBox);  
};  

// Esperar o carregamento completo da página  
window.addEventListener('load', createTestBox);