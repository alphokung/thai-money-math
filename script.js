let targetAmount = 0;
let currentAmount = 0;
let currentWallet = []; // Array to store objects {value: number, type: 'coin'|'note', id: timestamp}

const targetDisplay = document.getElementById('target-amount');
const currentDisplay = document.getElementById('current-amount');
const walletZone = document.getElementById('wallet-zone');
const celebrationOverlay = document.getElementById('celebration-overlay');
const placeholderText = document.querySelector('.placeholder-text');
const resetBtn = document.getElementById('reset-btn');

// Sound Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const playSound = (type) => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'coin') {
        // High pitched ping
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    } else if (type === 'note') {
        // Soft paper/thud sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.linearRampToValueAtTime(50, now + 0.1);
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
    } else if (type === 'error') {
        // Low buzzing error
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.5, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    } else if (type === 'win') {
        // Simple Arpeggio
        playNote(523.25, now, 0.1); // C5
        playNote(659.25, now + 0.1, 0.1); // E5
        playNote(783.99, now + 0.2, 0.1); // G5
        playNote(1046.50, now + 0.3, 0.4); // C6
    } else if (type === 'coin-drop') {
        // Re-using coin logic for consistency, or standardizing names
        playSound('coin');
    }
};

function playNote(freq, time, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    osc.start(time);
    osc.stop(time + duration);
}

function initGame() {
    // Generate random target between 10 and 40
    targetAmount = Math.floor(Math.random() * 31) + 10;
    updateDisplay();
    resetWallet();
    celebrationOverlay.classList.add('hidden');
    walletZone.classList.remove('correct');
}

function updateDisplay() {
    targetDisplay.textContent = targetAmount;
    currentDisplay.textContent = currentAmount;

    if (currentWallet.length > 0) {
        placeholderText.style.display = 'none';
    } else {
        placeholderText.style.display = 'block';
    }
}

function addToWallet(value) {
    if (currentAmount >= targetAmount) return; // Prevent adding if already over or equal

    const type = value <= 10 ? 'coin' : 'note';
    const moneyItem = {
        id: Date.now(),
        value: value,
        type: type,
        imgSrc: `assets/${type}_${value}.png`
    };

    currentWallet.push(moneyItem);
    currentAmount += value;

    renderWallet();
    updateDisplay();
    checkWinCondition();
    playSound(type);
}

function removeFromWallet(id) {
    const index = currentWallet.findIndex(item => item.id === id);
    if (index > -1) {
        const item = currentWallet[index];
        currentAmount -= item.value;
        currentWallet.splice(index, 1);
        renderWallet();
        updateDisplay();
        walletZone.classList.remove('wrong'); // Clear wrong state if removing
        playSound(item.type); // Play sound when returning money
    }
}

function renderWallet() {
    // Clear current wallet view (except placeholder)
    walletZone.innerHTML = '';

    if (currentWallet.length === 0) {
        walletZone.appendChild(placeholderText);
        return;
    }

    // Sort wallet by value (descending)
    currentWallet.sort((a, b) => b.value - a.value);

    // Group by value
    const groups = {};
    currentWallet.forEach(item => {
        if (!groups[item.value]) {
            groups[item.value] = [];
        }
        groups[item.value].push(item);
    });

    // Render groups
    // Sort keys descending to ensure order
    Object.keys(groups).sort((a, b) => b - a).forEach(value => {
        const groupContainer = document.createElement('div');
        groupContainer.className = 'money-group';

        groups[value].forEach(item => {
            const moneyEl = document.createElement('div');
            moneyEl.className = `money-item placed-money ${item.type}`;
            moneyEl.onclick = () => removeFromWallet(item.id);

            const img = document.createElement('img');
            img.src = item.imgSrc;
            const typeText = item.type === 'coin' ? 'เหรียญ' : 'ธนบัตร';
            img.alt = `${typeText} ${item.value} บาท`;

            moneyEl.appendChild(img);
            groupContainer.appendChild(moneyEl);
        });

        walletZone.appendChild(groupContainer);
    });
}

function checkWinCondition() {
    if (currentAmount === targetAmount) {
        walletZone.classList.add('correct');
        playSound('win');
        setTimeout(() => {
            celebrationOverlay.classList.remove('hidden');
            startConfetti();
        }, 500);
    } else if (currentAmount > targetAmount) {
        walletZone.classList.add('wrong');
        setTimeout(() => walletZone.classList.remove('wrong'), 500);
        playSound('error');
    }
}

function resetWallet() {
    currentAmount = 0;
    currentWallet = [];
    renderWallet();
    updateDisplay();
}

function startNewGame() {
    initGame();
}

function startConfetti() {
    // Placeholder for confetti effect
    // Could use canvas-confetti library if user permits or simple CSS particles
}

// Event Listeners
resetBtn.addEventListener('click', startNewGame);
document.getElementById('edit-target-btn').addEventListener('click', setCustomTarget);

function setCustomTarget() {
    const input = prompt("กำหนดยอดเงินเป้าหมาย (บาท):", targetAmount);
    if (input !== null) {
        const amount = parseInt(input, 10);
        if (!isNaN(amount) && amount > 0) {
            targetAmount = amount;
            resetWallet(); // Reset current progress but keep new target
            updateDisplay();
            celebrationOverlay.classList.add('hidden'); // Ensure overlay is hidden if it was showing
        } else {
            alert("กรุณาระบุตัวเลขที่ถูกต้อง (มากกว่า 0)");
        }
    }
}

// Initialize
initGame();
