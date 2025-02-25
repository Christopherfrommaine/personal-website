// Formatting on page: set to fill screen
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
document.body.appendChild(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// // Main Program
// Physics Constants
let G = 100;
let DT = 0.01;
let DAMPING = 0.001;
let STEPS = 20;  // Steps per Frame Multiplier
let IDENSITY = 0.05;  // Pixels per unit of mass

let M = 3;  // Number of Attractors
let N = 10000;  // Number of Particles

// Generate Particle List
let particles = {
    x: new Float32Array(N),
    y: new Float32Array(N),
    vx: new Float32Array(N),
    vy: new Float32Array(N),
};

let dx = Math.ceil(canvas.width / Math.sqrt(N * canvas.width / canvas.height));
let dy = Math.ceil(canvas.height / Math.sqrt(N * canvas.height / canvas.width));

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
let attractorPadding = 0.2;  // Proportion of the screen in which attractors will not spawn

interface Attractor {
    x: number;
    y: number;
    m: number;
}

let attractors: Attractor[] = [];
function randomAttractor(): Attractor {
    let x = attractorPadding * canvas.width + Math.random() * (1 - 2 * attractorPadding) * canvas.width;
    let y = attractorPadding * canvas.height + Math.random() * (1 - 2 * attractorPadding) * canvas.height;
    let m = 100 + 200 * Math.random()

    return {x, y, m};
}

function randomFarAttractor(maxiter: number): Attractor {
    let a = randomAttractor();
    
    for (let i = 0; i <= maxiter; i++) {
        let minDist = Infinity;
        for (let ao of attractors) {
            minDist = Math.min(minDist, (ao.x - a.x) ** 2 + (ao.y - a.y) ** 2);
        }

        if (minDist > 30000) {
            return a
        }
        
        a = randomAttractor();
    }

    return a
}

for (let i = 0; i < M; i++) {attractors.push(randomFarAttractor(10))}

// Resize Logic
let resizeTimeout: number | null = null;
function outOfBounds(x: number, y: number): boolean {
    return (x < 0 || y < 0 || x > canvas.width || y > canvas.height)
}
window.addEventListener("resize", () => {
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
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
function updateParticles() {
    for (let i = 0; i < N; i++) {
        let xForce = 0;
        let yForce = 0;

        for (let a of attractors) {
            let dsq = (a.x - particles.x[i]) ** 2 + (a.y - particles.y[i]) ** 2;

            // This check would make it much more accurate physically, but it looks better without:
            // if (dsq > (IDENSITY * a.m) ** 2)
            
            let forceMag = G * a.m / (dsq * Math.sqrt(dsq));  // Also includes vector normalization
            xForce += forceMag * (a.x - particles.x[i]);
            yForce += forceMag * (a.y - particles.y[i]);
            
        }

        // Upper bound on particle distance
        if (particles.x[i] ** 2 + particles.y[i] ** 2 > 1_000_000 * (canvas.width * canvas.height) ** 2) {
            particles.vx[i] = 0;
            particles.vy[i] = 0;
        }
        
        // Euler differential approximation
        particles.vx[i] += DT * xForce;
        particles.vy[i] += DT * yForce;
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

// Draw all particles and attractors to the screen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Particles
    ctx.fillStyle = particleColor;
    
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
    let dynamicSteps = Math.min(Math.max(1, Math.floor(10 * dt / (DT * STEPS))), 50);  // Adaptive step count
    for (let i = 0; i < dynamicSteps; i++) {updateParticles();}

    draw();
    requestAnimationFrame(animate);
}

animate();
