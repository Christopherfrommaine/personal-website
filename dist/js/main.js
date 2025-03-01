"use strict";
// Replace global-header elements with global/global-header.html
document.addEventListener('DOMContentLoaded', function () {
    const headerElement = document.getElementById('global-header');
    if (headerElement) {
        fetch('/global/global-header.html')
            .then(response => response.text())
            .then(data => {
            headerElement.innerHTML = data;
            // Manually load hamburger.js AFTER injecting global-header.html
            const script = document.createElement('script');
            script.src = '/js/hamburger.js';
            script.defer = true;
            document.body.appendChild(script);
        })
            .catch(error => console.error('Error loading global header:', error));
    }
});
// Replace global-footer elements with global/global-footer.html
document.addEventListener('DOMContentLoaded', function () {
    const headerElement = document.getElementById('global-footer');
    if (headerElement) {
        fetch('/global/global-footer.html')
            .then(response => response.text())
            .then(data => {
            headerElement.innerHTML = data;
        })
            .catch(error => console.error('Error loading global footer:', error));
    }
});
// Loaded class for fade-in
document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("loaded");
});
