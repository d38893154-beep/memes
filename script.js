/* ==================================================
   PRELOADER
   ================================================== */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
    }, 1200);
});

/* ==================================================
   MOBILE NAVIGATION
   ================================================== */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

/* ==================================================
   DYNAMIC CANVAS BACKGROUND
   ================================================== */
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeBgCanvas() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBgCanvas);
resizeBgCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Адаптивное количество частиц для слабых устройств
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 30 : 70;

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 1;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.color = Math.random() > 0.5 ? '#FF1493' : '#9D00FF';
        this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Автодвижение или отталкивание от мыши
        if (mouse.x !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                let force = (mouse.radius - dist) / mouse.radius;
                this.x -= (dx / dist) * force * 2;
                this.y -= (dy / dist) * force * 2;
            }
        }

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
    }

    draw() {
        bgCtx.save();
        bgCtx.globalAlpha = this.alpha;
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bgCtx.fillStyle = this.color;
        bgCtx.shadowBlur = 10;
        bgCtx.shadowColor = this.color;
        bgCtx.fill();
        bgCtx.restore();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateBg() {
    bgCtx.clearRect(0, 0, width, height);

    // Мягкое градиентное пятно
    let time = Date.now() * 0.0005;
    let gx = width / 2 + Math.sin(time) * 100;
    let gy = height / 2 + Math.cos(time * 0.8) * 100;
    let grad = bgCtx.createRadialGradient(gx, gy, 50, gx, gy, 400);
    grad.addColorStop(0, 'rgba(157, 0, 255, 0.15)');
    grad.addColorStop(1, 'rgba(5, 0, 8, 0)');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateBg);
}
animateBg();

/* ==================================================
   CALCULATOR
   ================================================== */
const calcForm = document.getElementById('calcForm');
const calcResult = document.getElementById('calcResult');
const calcPrice = document.getElementById('calcPrice');

calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const places = parseInt(document.getElementById('places').value) || 1;
    const typeCoeff = parseFloat(document.getElementById('type').value) || 1.0;

    // Демо-формула: базовый тариф $4/кг * коэффициент типа + $5 за каждое место
    let total = (weight * 4.5 * typeCoeff) + (places * 5);
    if (total < 15) total = 15; // Минимальный заказ

    calcPrice.textContent = `$${total.toFixed(2)}`;
    calcResult.style.display = 'block';
});

/* ==================================================
   COUNTER ANIMATION (SCROLL REVEAL)
   ================================================== */
const statsSection = document.querySelector('.stats-grid');
const statNums = document.querySelectorAll('.stat-num');
let animated = false;

function startCounters() {
    if (!statsSection) return;
    const pos = statsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight / 1.2;

    if (pos < screenPos && !animated) {
        animated = true;
        statNums.forEach(num => {
            const target = +num.getAttribute('data-target');
            let count = 0;
            const speed = target / 50;

            const update = () => {
                count += speed;
                if (count < target) {
                    num.textContent = `+${Math.ceil(count)}`;
                    setTimeout(update, 30);
                } else {
                    num.textContent = `+${target}`;
                }
            };
            update();
        });
    }
}
window.addEventListener('scroll', startCounters);

/* ==================================================
   SYNTHESIZER BACKGROUND MUSIC (NO EXTERNAL MP3)
   ================================================== */
let audioCtx = null;
let isPlaying = false;
let synthTimer = null;

const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicText = musicToggleBtn.querySelector('.music-text');

function playCyberChords() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    const notes = [220, 261.63, 329.63, 392.00]; // A minor 7th synth ambient notes
    let step = 0;

    synthTimer = setInterval(() => {
        if (!isPlaying) return;
        
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.6);

        step++;
    }, 1500);
}

musicToggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
        isPlaying = true;
        musicText.textContent = "MUSIC ON";
        playCyberChords();
    } else {
        isPlaying = false;
        musicText.textContent = "MUSIC OFF";
        clearInterval(synthTimer);
    }
});

/* ==================================================
   GAME: DIANA NEON DELIVERY
   ================================================== */
const gameCanvas = document.getElementById('gameCanvas');
const gCtx = gameCanvas.getContext('2d');
const startGameBtn = document.getElementById('startGameBtn');
const gameOverlay = document.getElementById('gameOverlay');
const gameScoreEl = document.getElementById('gameScore');
const gameDeliveriesEl = document.getElementById('gameDeliveries');
const gameHighScoreEl = document.getElementById('gameHighScore');

// Game variables
let gameRunning = false;
let score = 0;
let deliveries = 0;
let highScore = localStorage.getItem('diana_game_highscore') || 0;
gameHighScoreEl.textContent = String(highScore).padStart(4, '0');

let truck = {
    x: 100,
    y: 200,
    w: 40,
    h: 24,
    speed: 4,
    hasPackage: false
};

let cargo = { x: 300, y: 150, w: 20, h: 20, active: true };
let dropZone = { x: 700, y: 200, w: 50, h: 50 };
let obstacles = [
    { x: 400, y: 100, w: 30, h: 30, type: 'block' },
    { x: 500, y: 300, w: 40, h: 40, type: 'puddle' }
];

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Touch inputs
const bindTouch = (id, keyName) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); keys[keyName] = true; });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[keyName] = false; });
};
bindTouch('btnUp', 'ArrowUp');
bindTouch('btnDown', 'ArrowDown');
bindTouch('btnLeft', 'ArrowLeft');
bindTouch('btnRight', 'ArrowRight');

function spawnCargo() {
    cargo.x = 80 + Math.random() * (gameCanvas.width - 250);
    cargo.y = 50 + Math.random() * (gameCanvas.height - 100);
    cargo.active = true;
}

function updateGame() {
    if (!gameRunning) return;

    // Movement
    if (keys['ArrowUp'] || keys['w'] || keys['W']) truck.y -= truck.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) truck.y += truck.speed;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) truck.x -= truck.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) truck.x += truck.speed;

    // Canvas boundaries
    truck.x = Math.max(0, Math.min(gameCanvas.width - truck.w, truck.x));
    truck.y = Math.max(0, Math.min(gameCanvas.height - truck.h, truck.y));

    // Cargo pickup
    if (!truck.hasPackage && cargo.active && checkCollision(truck, cargo)) {
        truck.hasPackage = true;
        cargo.active = false;
    }

    // Cargo dropoff
    if (truck.hasPackage && checkCollision(truck, dropZone)) {
        truck.hasPackage = false;
        score += 100;
        deliveries += 1;
        gameScoreEl.textContent = String(score).padStart(4, '0');
        gameDeliveriesEl.textContent = String(deliveries).padStart(2, '0');
        spawnCargo();

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('diana_game_highscore', highScore);
            gameHighScoreEl.textContent = String(highScore).padStart(4, '0');
        }
    }

    // Obstacle collision
    obstacles.forEach(obs => {
        if (checkCollision(truck, obs)) {
            if (obs.type === 'block') {
                gameOver();
            }
        }
    });
}

function checkCollision(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function drawGame() {
    gCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // City roads grid
    gCtx.strokeStyle = 'rgba(157, 0, 255, 0.15)';
    gCtx.lineWidth = 1;
    for (let i = 0; i < gameCanvas.width; i += 40) {
        gCtx.beginPath(); gCtx.moveTo(i, 0); gCtx.lineTo(i, gameCanvas.height); gCtx.stroke();
    }

    // Dropzone
    gCtx.fillStyle = 'rgba(255, 20, 147, 0.2)';
    gCtx.strokeStyle = '#FF1493';
    gCtx.lineWidth = 2;
    gCtx.fillRect(dropZone.x, dropZone.y, dropZone.w, dropZone.h);
    gCtx.strokeRect(dropZone.x, dropZone.y, dropZone.w, dropZone.h);

    // Cargo
    if (cargo.active) {
        gCtx.fillStyle = '#FF4DB8';
        gCtx.shadowBlur = 10;
        gCtx.shadowColor = '#FF4DB8';
        gCtx.fillRect(cargo.x, cargo.y, cargo.w, cargo.h);
        gCtx.shadowBlur = 0;
    }

    // Obstacles
    obstacles.forEach(obs => {
        gCtx.fillStyle = obs.type === 'block' ? '#9D00FF' : 'rgba(0,255,255,0.4)';
        gCtx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });

    // Truck
    gCtx.fillStyle = truck.hasPackage ? '#FF4DB8' : '#FFFFFF';
    gCtx.shadowBlur = 15;
    gCtx.shadowColor = '#FF1493';
    gCtx.fillRect(truck.x, truck.y, truck.w, truck.h);
    gCtx.shadowBlur = 0;
}

function gameLoop() {
    updateGame();
    drawGame();
    if (gameRunning) requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameRunning = false;
    document.getElementById('overlayTitle').textContent = "GAME OVER";
    document.getElementById('overlayDesc').textContent = `Счёт: ${score} | Доставлено: ${deliveries}`;
    startGameBtn.textContent = "ИГРАТЬ СНОВА";
    gameOverlay.style.display = 'flex';
}

startGameBtn.addEventListener('click', () => {
    score = 0;
    deliveries = 0;
    truck.x = 50;
    truck.y = 200;
    truck.hasPackage = false;
    gameScoreEl.textContent = '0000';
    gameDeliveriesEl.textContent = '00';
    spawnCargo();
    gameOverlay.style.display = 'none';
    gameRunning = true;
    gameLoop();
});