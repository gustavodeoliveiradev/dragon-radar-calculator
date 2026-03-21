// --- 1. CONFIGURAÇÕES E SELETORES ---
const elements = {
    display: document.getElementById('display'),
    radar: document.getElementById('radar'),
    pwrBtn: document.getElementById('pwr'),
    radarPoint: document.getElementById('radar-point')
};

const sounds = {
    on: document.getElementById('sound-power-on'),
    off: document.getElementById('sound-power-off'),
    equal: document.getElementById('sound-equal'),
    error: document.getElementById('sound-error')
};

let radarInterval;

// Helper para tocar sons (Evitando a repetição de código)
const playAudio = (audio) => {
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
};

// --- 2. OPERAÇÕES DA CALCULADORA ---
const appendToDisplay = value => {
    if (elements.radar.classList.contains('on')) {
        // Se o valor for 0 (inicial), substitui pelo novo valor
        if (elements.display.value === "0") elements.display.value = "";
        elements.display.value += value;
    }
};

const clearDisplay = () => elements.display.value = "0";

const deleteLast = () => {
    elements.display.value = elements.display.value.slice(0, -1);
    if (elements.display.value === "") elements.display.value = "0";
};

const calculateResult = () => {
    if (!elements.radar.classList.contains('on')) return;

    try {
        const mathExpr = elements.display.value;
        const result = new Function(`return ${mathExpr}`)();

        if (result === Infinity || isNaN(result)) throw new Error();

        elements.display.value = result;
        playAudio(sounds.equal);

        // Feedback Visual: Brilho da Esfera
        elements.radarPoint.classList.add('found');
        setTimeout(() => elements.radarPoint.classList.remove('found'), 1000);

    } catch (e) {
        elements.display.value = "ERRO";
        elements.display.classList.add('shake');
        playAudio(sounds.error);
        setTimeout(() => elements.display.classList.remove('shake'), 500);
    }
};

// --- 3. LÓGICA DO AMBIENTE (RADAR) ---
const togglePower = () => {
    const isOn = elements.radar.classList.toggle('on');
    elements.pwrBtn.innerText = isOn ? "OFF" : "ON";
    elements.pwrBtn.classList.toggle('active');

    if (isOn) {
        playAudio(sounds.on);
        startRadarMovement();
    } else {
        playAudio(sounds.off);
        stopRadarMovement();
        clearDisplay();
    }
};

const startRadarMovement = () => {
    stopRadarMovement();
    radarInterval = setInterval(() => {
        const x = Math.random() * (window.innerWidth - 50);
        const y = Math.random() * (window.innerHeight - 50);

        elements.radarPoint.style.left = `${x}px`;
        elements.radarPoint.style.top = `${y}px`;
    }, 4000);
};

const stopRadarMovement = () => clearInterval(radarInterval);

// --- 4. EVENT LISTENERS (INTERAÇÕES) ---

// Teclado Físico
document.addEventListener('keydown', (e) => {
    if (!elements.radar.classList.contains('on')) return;

    if (/[0-9+\-*/.]/.test(e.key)) appendToDisplay(e.key);
    if (e.key === 'Enter') { e.preventDefault(); calculateResult(); }
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
});