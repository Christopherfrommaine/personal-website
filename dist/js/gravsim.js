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
let STEPS = 10; // Steps per Frame
// Number of Attractors:
let M = 3;
// Generate Particle List
let particles = [];
for (let x = 0; x < canvas.width; x += 5) {
    for (let y = 0; y < canvas.height; y += 5) {
        particles.push({ x, y, vx: 0, vy: 0 });
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
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        let xForce = 0;
        let yForce = 0;
        for (let a of attractors) {
            let dsq = Math.pow((a.x - p.x), 2) + Math.pow((a.y - p.y), 2);
            let forceMag = G * a.m / (dsq * Math.sqrt(dsq)); // Also includes vector normalization
            xForce += forceMag * (a.x - p.x);
            yForce += forceMag * (a.y - p.y);
        }
        let vxo = p.vx;
        let vyo = p.vy;
        p.vx += DT * xForce;
        p.vy += DT * yForce;
        p.vx *= (1 - DT * DAMPING);
        p.vy *= (1 - DT * DAMPING);
        p.x += 0.5 * DT * (p.vx + vxo); // Trapezoidal differential equation optimization
        p.y += 0.5 * DT * (p.vy + vyo);
    }
    particles = particles.filter((p) => !outOfBounds(p));
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw Particles
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"; // Transparent to act as background
    // Batched rendering for large improvement
    ctx.beginPath();
    for (let p of particles) {
        ctx.moveTo(p.x + 2, p.y);
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
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
