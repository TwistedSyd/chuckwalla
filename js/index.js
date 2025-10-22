// Index page JavaScript

function toggleNav() {
    const hamburger = document.querySelector('.hamburger-menu');
    const overlay = document.getElementById('navOverlay');
    const backdrop = document.getElementById('navBackdrop');

    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    backdrop.classList.toggle('active');
}
