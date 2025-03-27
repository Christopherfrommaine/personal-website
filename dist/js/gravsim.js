"use strict";
// Formatting on page: set to fill screen
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// // Main Program
// Physics Constants
const G = 100;
let DT = 0.01;
const DAMPING = 0.001;
const STEPS = 20; // Steps per Frame Multiplier
const IDENSITY = 0.05; // Pixels per unit of mass
const M = 3; // Number of Attractors
let N = 10000; // Number of Particles
if (canvas.height < 500) {
    N = 1000;
    DT *= 0.75;
}
// Generate Particle List
let particles = {
    x: new Float32Array(N),
    y: new Float32Array(N),
    vx: new Float32Array(N),
    vy: new Float32Array(N),
};
const dx = Math.ceil(canvas.width / Math.sqrt(N * canvas.width / canvas.height));
const dy = Math.ceil(canvas.height / Math.sqrt(N * canvas.height / canvas.width));
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
const attractorPadding = 0.2; // Proportion of the screen in which attractors will not spawn
let attractors = [];
function randomAttractor() {
    let x = attractorPadding * canvas.width + Math.random() * (1 - 2 * attractorPadding) * canvas.width;
    let y = attractorPadding * canvas.height + Math.random() * (1 - 2 * attractorPadding) * canvas.height;
    let m = 100 + 200 * Math.random();
    return { x, y, m, gm: G * m };
}
function randomFarAttractor(maxiter) {
    let a = randomAttractor();
    for (let i = 0; i <= maxiter; i++) {
        let minDist = Infinity;
        for (let ao of attractors) {
            minDist = Math.min(minDist, Math.pow((ao.x - a.x), 2) + Math.pow((ao.y - a.y), 2));
        }
        if (minDist > 30000) {
            return a;
        }
        a = randomAttractor();
    }
    return a;
}
for (let i = 0; i < M; i++) {
    attractors.push(randomFarAttractor(10));
}
// Resize Logic
let resizeTimeout = null;
function outOfBounds(x, y) {
    return (x < 0 || y < 0 || x > canvas.width || y > canvas.height);
}
window.addEventListener("resize", () => {
    if (resizeTimeout)
        cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        for (let i = 0; i < M; i++) {
            if (outOfBounds(attractors[i].x, attractors[i].y)) {
                attractors[i] = randomFarAttractor(10);
            }
        }
    });
});
// Physics
const MAX_DIST = 1000000 * (canvas.width * canvas.height);
function updateParticles() {
    for (let i = 0; i < N; i++) {
        let xForce = 0;
        let yForce = 0;
        let px = particles.x[i];
        let py = particles.y[i];
        let pvx = particles.vx[i];
        let pvy = particles.vy[i];
        for (let a of attractors) {
            let dx = a.x - px;
            let dy = a.y - py;
            let invd = 1 / Math.sqrt(dx * dx + dy * dy);
            // This check would make it much more accurate physically, but it looks better without:
            // Also adds a conditional, which is expensive.
            // if (dsq > (IDENSITY * a.m) ** 2)
            let forceMag = a.gm * invd * invd * invd; // Also includes vector normalization
            xForce += forceMag * dx;
            yForce += forceMag * dy;
        }
        // Upper bound on particle distance
        let oob = (px * px + py * py < MAX_DIST) ? 1 : 0;
        // Euler differential approximation
        particles.vx[i] = oob * (pvx + DT * xForce);
        particles.vy[i] = oob * (pvy + DT * yForce);
        particles.x[i] += DT * particles.vx[i];
        particles.y[i] += DT * particles.vy[i];
    }
}
// // Display and loop
// Define Colors
const particleColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-gravsim-particle").trim();
const attractorColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-gravsim-attractor").trim();
// Precompute circle approximation, arc() can be expensive
const vertices = 8;
const radius = 2;
let polygon = [];
for (let i = 0; i < vertices; i++) {
    let angle = 2 * i * Math.PI / vertices;
    polygon.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
}
// Draw all particles and attractors to the screen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw Particles
    ctx.fillStyle = particleColor;
    // Batched rendering for large improvement
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
        if (!outOfBounds(particles.x[i], particles.y[i])) {
            ctx.moveTo(particles.x[i] + polygon[0][0], particles.y[i] + polygon[0][1]);
            for (let j = 0; j < vertices; j++) {
                ctx.lineTo(particles.x[i] + polygon[j][0], particles.y[i] + polygon[j][1]);
            }
        }
    }
    ctx.fill();
    // Draw Attractors
    ctx.fillStyle = attractorColor;
    ctx.beginPath();
    for (let a of attractors) {
        ctx.moveTo(a.x + IDENSITY * a.m, a.y);
        ctx.arc(a.x, a.y, IDENSITY * a.m, 0, Math.PI * 2);
    }
    ctx.fill();
}
let lastTime = performance.now();
function animate() {
    let now = performance.now();
    let dt = (now - lastTime) * DT;
    lastTime = now;
    let dynamicSteps = Math.min(Math.max(1, Math.floor(10 * dt / (DT * STEPS))), 50); // Adaptive step count
    for (let i = 0; i < dynamicSteps; i++) {
        updateParticles();
    }
    draw();
    requestAnimationFrame(animate);
}
animate();
