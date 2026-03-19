// 1. Seleção de Elementos
const display = document.getElementById('display');
const radar = document.getElementById('radar');
const pwrBtn = document.getElementById('pwr');
const radarPoint = document.getElementById('radar-point');

// Sons
const soundPowerOn = document.getElementById('sound-power-on');
const soundPowerOff = document.getElementById('sound-power-off');
const soundEqual = document.getElementById('sound-equal');

let radarInterval; // Para controlar o movimento sem travar

// 2. Funções da Calculadora
const appendToDisplay = value => {
    if (radar.classList.contains('on')) {
        display.value += value;
    }
};

const clearDisplay = () => display.value = "";
const deleteLast = () => display.value = display.value.slice(0, -1);

const calculateResult = () => {
    try {
        const result = new Function(`return ${display.value}`)();
        display.value = (result === Infinity || isNaN(result)) ? "Erro" : result;

        // Toca o som do "igual"
        if (soundEqual) {
            soundEqual.currentTime = 0;
            soundEqual.play();
        }
    } catch (e) {
        display.value = "Erro";
    }
};

// 3. Lógica do Radar e Poder (UNIFICADA)
function togglePower() {
    radar.classList.toggle('on');
    const isOn = radar.classList.contains('on');

    // Troca o texto e toca o som
    pwrBtn.innerText = isOn ? "OFF" : "ON";

    if (isOn) {
        if (soundPowerOn) {
            soundPowerOn.currentTime = 0;
            soundPowerOn.play();
        }
        startRadarMovement();
    } else {
        if (soundPowerOff) {
            soundPowerOff.currentTime = 0;
            soundPowerOff.play();
        }
        stopRadarMovement();
        clearDisplay();
    }
}

// 4. Movimentação Inteligente
function startRadarMovement() {
    // Limpa qualquer intervalo anterior para não acumular
    stopRadarMovement();

    radarInterval = setInterval(() => {
        const x = Math.random() * (window.innerWidth - 50);
        const y = Math.random() * (window.innerHeight - 50);

        radarPoint.style.left = `${x}px`;
        radarPoint.style.top = `${y}px`;
    }, 4000);
}

function stopRadarMovement() {
    clearInterval(radarInterval);
}