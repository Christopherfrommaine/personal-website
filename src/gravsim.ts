// Formatting on page: set to fill screen
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Define Colors
const particleColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-gravsim-particle")
    .trim();
const attractorColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-gravsim-attractor")
    .trim();

// // Main Program
// Physics Constants
let G = 100;
let DT = 0.1;
let DAMPING = 0.001;
let STEPS = 1;  // Steps per Frame Multiplier

let M = 3;  // Number of Attractors
let N = 10000;  // Number of Particles

// // Program
interface Attractor {
    x: number;
    y: number;
    m: number;
}

// Generate Particle List
let dx = Math.ceil(canvas.width / Math.sqrt(N * canvas.width / canvas.height));
let dy = Math.ceil(canvas.height / Math.sqrt(N * canvas.height / canvas.width));

let particles = {
    x: new Float32Array(N),
    y: new Float32Array(N),
    vx: new Float32Array(N),
    vy: new Float32Array(N),
};
let index = 0;
for (let x = 0; x < canvas.width; x += dx) {
    for (let y = 0; y < canvas.height; y += dy) {
        if (index < N) {
            particles.x[index] = x;
            particles.y[index] = y;
            index++;
        }
    }
}


// Generate Attractor List
let attractorPadding = 0.2;
function randomAttractor(): Attractor {

    let x = attractorPadding * canvas.width + Math.random() * (1 - 2 * attractorPadding) * canvas.width;
    let y = attractorPadding * canvas.height + Math.random() * (1 - 2 * attractorPadding) * canvas.height;
    let m = 100 + 200 * Math.random()

    return {x, y, m};
}
let attractors: Attractor[] = [];
for (let i = 0; attractors.length < M; i++) {
    let a = randomAttractor();
    let minDist = Infinity;
    for (let ao of attractors) {
        minDist = Math.min(minDist, (ao.x - a.x) ** 2 + (ao.y - a.y) ** 2);
    }

    if (minDist > 30000 || i > 10) {
        attractors.push(a);
    }
}

// Resize Logic
let resizeTimeout: number | null = null;

function outOfBounds(x: number, y: number): boolean {
    return (x < 0 || y < 0 || x > canvas.width || y > canvas.height);
}

window.addEventListener("resize", () => {
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        for (let i = 0; i < M; i++) {
            if (outOfBounds(attractors[i].x, attractors[i].y)) {attractors[i] = randomAttractor();}
        }
    });
});

// Physics
function netGravForceX(x: number, y: number): number {
    let force = 0;

    for (let a of attractors) {
        let dsq = (a.x - x) ** 2 + (a.y - y) ** 2;

        // Also includes vector normalization
        force += G * a.m / (dsq * Math.sqrt(dsq)) * (a.x - x);
    }

    return force;
}
function netGravForceY(x: number, y: number): number {
    let force = 0;

    for (let a of attractors) {
        let dsq = (a.x - x) ** 2 + (a.y - y) ** 2;

        // Also includes vector normalization
        force += G * a.m * (a.y - y) / (dsq * Math.sqrt(dsq));
    }

    return force;
}


function updateParticles() {
    for (let i = 0; i < N; i++) {
        let k1, k2, k3, k4;

        // RK4 for x axis velocity
        k1 = DT * netGravForceX(particles.x[i], particles.y[i] );
        k2 = DT * netGravForceX(particles.x[i], particles.y[i] + .5 * k1);
        k3 = DT * netGravForceX(particles.x[i], particles.y[i] + .5 * k2);
        k4 = DT * netGravForceX(particles.x[i], particles.y[i] + k3);
        particles.vx[i] += (k1 + 2 * k2 + 2 * k3 + k4) / 6;

        // RK4 for y axis velocity
        k1 = DT * netGravForceY(particles.x[i],            particles.y[i]);
        k2 = DT * netGravForceY(particles.x[i] + .5 * k1, particles.y[i]);
        k3 = DT * netGravForceY(particles.x[i] + .5 * k2, particles.y[i]);
        k4 = DT * netGravForceY(particles.x[i] + k3,      particles.y[i]);
        particles.vy[i] += (k1 + 2 * k2 + 2 * k3 + k4) / 6;

        // RK4 for x axis position
        k1 = DT * (particles.vx[i]);
        k2 = DT * (particles.vx[i] + .5 * k1);
        k3 = DT * (particles.vx[i] + .5 * k2);
        k4 = DT * (particles.vx[i] + k3);
        particles.x[i] += (k1 + 2 * k2 + 2 * k3 + k4) / 6;

        // RK4 for y axis position
        k1 = DT * (particles.vy[i] );
        k2 = DT * (particles.vy[i] + .5 * k1);
        k3 = DT * (particles.vy[i] + .5 * k2);
        k4 = DT * (particles.vy[i] + k3);
        particles.y[i] += (k1 + 2 * k2 + 2 * k3 + k4) / 6;

    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Particles
    ctx.fillStyle = particleColor;  // Transparent to act as background
    
    // Batched rendering for large improvement
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
        if (!outOfBounds(particles.x[i], particles.y[i])) {
            ctx.moveTo(particles.x[i] + 2, particles.y[i]);
            ctx.arc(particles.x[i], particles.y[i], 2, 0, Math.PI * 2);
        }
    }
    ctx.fill();

    // Draw Attractors
    ctx.fillStyle = attractorColor;  // Transparent to act as background
    
    ctx.beginPath();
    for (let a of attractors) {
        ctx.moveTo(a.x + 0.05 * a.m, a.y);
        ctx.arc(a.x, a.y, 0.05 * a.m, 0, Math.PI * 2);
    }
    ctx.fill();
}

let lastTime = performance.now();

function animate() {
    updateParticles();
    draw();
    requestAnimationFrame(animate);
}

animate();
