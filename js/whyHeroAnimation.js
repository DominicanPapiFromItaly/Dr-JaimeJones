const canvas = document.getElementById('why-hero-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = 380; // altezza fissa hero

// Punto di convergenza / Posizione del dente
let coreX = width * 0.82;
let coreY = height * 0.50;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = 380;
    coreX = width * 0.82;
    coreY = height * 0.50;
});

// Angolo di rotazione per il dente
let toothAngle = 0;

// --- DISEGNO DENTE ROTANTE ---
function drawRotatingTooth(cx, cy, angle) {
    ctx.save();
    ctx.translate(cx, cy);

    // Contrazione X per simulare la rotazione 3D
    const scaleX = Math.cos(angle);

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.9)'; // Contorno verde neon
    ctx.lineWidth = 2;

    ctx.beginPath();
    // Corona del dente
    ctx.moveTo(-25 * scaleX, -30);
    ctx.bezierCurveTo(-30 * scaleX, -45, -10 * scaleX, -50, 0, -42);
    ctx.bezierCurveTo(10 * scaleX, -50, 30 * scaleX, -45, 25 * scaleX, -30);

    // Lato Destro e Radice Destra
    ctx.bezierCurveTo(35 * scaleX, -10, 25 * scaleX, 10, 18 * scaleX, 35);
    ctx.bezierCurveTo(12 * scaleX, 48, 5 * scaleX, 45, 3 * scaleX, 10);

    // Radice Sinistra e Lato Sinistro
    ctx.bezierCurveTo(-5 * scaleX, 45, -12 * scaleX, 48, -18 * scaleX, 35);
    ctx.bezierCurveTo(-25 * scaleX, 10, -35 * scaleX, -10, -25 * scaleX, -30);

    ctx.closePath();
    
    // Gradiente sfumato verde smeraldo
    const toothGradient = ctx.createLinearGradient(-30 * scaleX, -50, 30 * scaleX, 50);
    toothGradient.addColorStop(0, '#a7f3d0');
    toothGradient.addColorStop(0.5, '#10b981');
    toothGradient.addColorStop(1, '#047857');
    ctx.fillStyle = toothGradient;
    ctx.fill();

    // Bagliore diretto del dente
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 18;
    ctx.stroke();

    ctx.restore();
}

// --- CLASSE PARTICELLE / FASCI LASER ---
class Particle {
    constructor() { this.reset(); }

    reset() {
        this.startX = 0;
        this.startY = Math.random() * height;
        this.x = this.startX;
        this.y = this.startY;

        this.ctrlX = width * 0.35;
        this.ctrlY = this.startY + (coreY - this.startY) * 0.25;

        this.progress = Math.random();
        this.speed = 0.002 + Math.random() * 0.0035;
        this.size = 1 + Math.random() * 2.5;
        this.alpha = Math.random() * 0.5 + 0.3;

        // Tonalità di verde (da smeraldo a neon)
        const greenHue = Math.floor(140 + Math.random() * 30);
        this.color = `hsla(${greenHue}, 90%, 60%, `;
    }

    update() {
        this.progress += this.speed;
        if (this.progress > 1) this.reset();

        const t = this.progress;
        // Curva verso il dente
        this.x = (1 - t) ** 2 * this.startX + 2 * (1 - t) * t * this.ctrlX + t ** 2 * coreX;
        this.y = (1 - t) ** 2 * this.startY + 2 * (1 - t) * t * this.ctrlY + t ** 2 * coreY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
    }
}

const particles = Array.from({ length: 220 }, () => new Particle());

// --- LOOP DI ANIMAZIONE ---
function animate() {
    // Sfondo scuro verde notte con scia (motion blur)
    ctx.fillStyle = 'rgba(2, 18, 12, 0.09)';
    ctx.fillRect(0, 0, width, height);

    // 1. Bagliore d'aura verde attorno al dente
    const pulse = Math.sin(Date.now() * 0.003) * 15;
    const gradient = ctx.createRadialGradient(coreX, coreY, 10, coreX, coreY, 200 + pulse);
    gradient.addColorStop(0, 'rgba(52, 211, 153, 0.35)');
    gradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.12)'); 
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(coreX, coreY, 200 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 2. Particelle laser
    particles.forEach(p => { p.update(); p.draw(); });

    // 3. Dente rotante al centro dell'aura
    toothAngle += 0.02;
    drawRotatingTooth(coreX, coreY, toothAngle);

    requestAnimationFrame(animate);
}

animate();