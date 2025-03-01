"use strict";
// Toggles the hamburger menu on mobile
const button = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-menu');
if (menu && button) {
    button.addEventListener('click', (event) => {
        event.stopPropagation();
        menu.classList.toggle('show');
    });
    document.addEventListener('click', (event) => {
        if (menu.classList.contains('show') && !menu.contains(event.target)) {
            menu.classList.remove('show');
        }
    });
    menu.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            menu.classList.remove('show');
        }
    });
}
