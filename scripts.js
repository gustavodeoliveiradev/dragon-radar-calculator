// --- 1. SELEÇÃO DE ELEMENTOS ---
const display = document.getElementById('display');
const radar = document.getElementById('radar');
const pwrBtn = document.getElementById('pwr');
const radarPoint = document.getElementById('radar-point');

// Sons
const soundPowerOn = document.getElementById('sound-power-on');
const soundPowerOff = document.getElementById('sound-power-off');
const soundEqual = document.getElementById('sound-equal');
const soundError = document.getElementById('sound-error');

let radarInterval; // Controle do movimento

// --- 2. FUNÇÕES BÁSICAS DA CALCULADORA ---
const appendToDisplay = value => {
    // Só funciona se o radar estiver ligado
    if (radar.classList.contains('on')) {
        display.value += value;
    }
};

const clearDisplay = () => display.value = "";

const deleteLast = () => display.value = display.value.slice(0, -1);

const calculateResult = () => {
    if (!radar.classList.contains('on')) return;

    try {
        // A "mágica" do cálculo
        const result = new Function(`return ${display.value}`)();

        if (result === Infinity || isNaN(result)) throw new Error();

        display.value = result;
        
        if (soundEqual) {
            soundEqual.currentTime = 0;
            soundEqual.play();
        }

        // Efeito: Esfera Encontrada (Brilho no ponto por 1s)
        radarPoint.classList.add('found');
        setTimeout(() => radarPoint.classList.remove('found'), 1000);

    } catch (e) {
        display.value = "ERRO";
        display.classList.add('shake');
        
        if (soundError) {
            soundError.currentTime = 0;
            soundError.play();
        }
        
        setTimeout(() => display.classList.remove('shake'), 500);
    }
};

// --- 3. SUPORTE AO TECLADO (PC) ---
document.addEventListener('keydown', (event) => {
    if (!radar.classList.contains('on')) return;

    const key = event.key;

    // Números e Operadores (usando RegEx para validar)
    if (/[0-9+\-*/.]/.test(key)) {
        appendToDisplay(key);
    }
    // Enter para calcular
    else if (key === 'Enter') {
        event.preventDefault(); 
        calculateResult();
    }
    // Backspace para apagar um
    else if (key === 'Backspace') {
        deleteLast();
    }
    // Escape para limpar tudo
    else if (key === 'Escape') {
        clearDisplay();
    }
});

// --- 4. LÓGICA DO RADAR E ENERGIA ---
function togglePower() {
    radar.classList.toggle('on');
    const isOn = radar.classList.contains('on');

    // Troca o texto do botão (Ternário)
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

// --- 5. MOVIMENTAÇÃO DO PONTO ---
function startRadarMovement() {
    stopRadarMovement(); // Limpa intervalos antigos

    radarInterval = setInterval(() => {
        // O ponto flutua pela tela
        const x = Math.random() * (window.innerWidth - 50);
        const y = Math.random() * (window.innerHeight - 50);

        radarPoint.style.left = `${x}px`;
        radarPoint.style.top = `${y}px`;
    }, 4000);
}

function stopRadarMovement() {
    clearInterval(radarInterval);
}