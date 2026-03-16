const display = document.getElementById('display');

// Funções da Calculadora
const appendToDisplay = value => {
    if (document.getElementById('radar').classList.contains('on')) {
        display.value += value;
    }
};

const clearDisplay = () => display.value = "";

const deleteLast = () => display.value = display.value.slice(0, -1);

const calculateResult = () => {
    try {
        const result = new Function(`return ${display.value}`)();
        display.value = (result === Infinity || isNaN(result)) ? "Erro" : result;
    } catch (e) {
        display.value = "Erro";
    }
};

// Lógica de Poder e Radar
function togglePower() {
    const radar = document.getElementById('radar');
    const pwrBtn = document.getElementById('pwr');

    radar.classList.toggle('on');
    pwrBtn.classList.toggle('active');

    if (radar.classList.contains('on')) {
        moveRadarPoint();
    } else {
        clearDisplay();
    }
}

function moveRadarPoint() {
    const radar = document.getElementById('radar');
    const point = document.getElementById('radar-point');

    if (!radar.classList.contains('on')) return;

    // Calcula posição aleatória em toda a janela do navegador
    const x = Math.random() * (window.innerWidth - 50);
    const y = Math.random() * (window.innerHeight - 50);

    point.style.left = `${x}px`;
    point.style.top = `${y}px`;

    // Move de novo após 4 segundos
    setTimeout(moveRadarPoint, 4000);
}