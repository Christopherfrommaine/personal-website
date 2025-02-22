"use strict";
// Formatting on page: set to fill screen
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.zIndex = "1";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// // Main Program
// Physics Constants
let G = 100;
let DT = 0.01;
let DAMPING = 0.01;
let STEPS = 20; // Steps per Frame
let M = 3; // Number of Attractors
let N = 10000; // Number of Particles
// Generate Particle List
let dx = canvas.width / Math.sqrt(N * canvas.width / canvas.height);
let dy = canvas.height / Math.sqrt(N * canvas.height / canvas.width);
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
function randomAttractor() {
    let x = 0.1 * canvas.width + Math.random() * 0.8 * canvas.width;
    let y = 0.1 * canvas.height + Math.random() * 0.8 * canvas.height;
    let m = 100 + 200 * Math.random();
    return { x, y, m };
}
let attractors = [];
for (let i = 0; i < M; i++) {
    attractors.push(randomAttractor());
}
// Resize Logic
let resizeTimeout = null;
function outOfBounds(p) {
    return (p.x < 0 || p.y < 0 || p.x > canvas.width || p.y > canvas.height);
}
window.addEventListener("resize", () => {
    if (resizeTimeout)
        cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        for (let i = 0; i < M; i++) {
            if (outOfBounds(attractors[i])) {
                attractors[i] = randomAttractor();
            }
        }
    });
});
// Physics
function updateParticles() {
    for (let i = 0; i < N; i++) {
        let xForce = 0;
        let yForce = 0;
        for (let a of attractors) {
            let dsq = Math.pow((a.x - particles.x[i]), 2) + Math.pow((a.y - particles.y[i]), 2);
            let forceMag = G * a.m / (dsq * Math.sqrt(dsq)); // Also includes vector normalization
            xForce += forceMag * (a.x - particles.x[i]);
            yForce += forceMag * (a.y - particles.y[i]);
        }
        let vxo = particles.vx[i];
        let vyo = particles.vy[i];
        particles.vx[i] += DT * xForce;
        particles.vy[i] += DT * yForce;
        particles.vx[i] *= (1 - DT * DAMPING);
        particles.vy[i] *= (1 - DT * DAMPING);
        particles.x[i] += 0.5 * DT * (particles.vx[i] + vxo); // Trapezoidal differential equation optimization
        particles.y[i] += 0.5 * DT * (particles.vy[i] + vyo);
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw Particles
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // Transparent to act as background
    // Batched rendering for large improvement
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
        ctx.moveTo(particles.x[i] + 2, particles.y[i]);
        ctx.arc(particles.x[i], particles.y[i], 2, 0, Math.PI * 2);
    }
    ctx.fill();
    // Draw Attractors
    ctx.fillStyle = "rgba(255, 32, 32, 0.3)"; // Transparent to act as background
    ctx.beginPath();
    for (let a of attractors) {
        ctx.moveTo(a.x + 0.05 * a.m, a.y);
        ctx.arc(a.x, a.y, 0.05 * a.m, 0, Math.PI * 2);
    }
    ctx.fill();
}
function animate() {
    for (let i = 0; i < STEPS; i++) {
        updateParticles();
    }
    draw();
    requestAnimationFrame(animate);
}
animate();
