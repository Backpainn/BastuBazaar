function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;
    
    // Remove old listener if we are re-initializing
    const newBtn = themeToggleBtn.cloneNode(true);
    themeToggleBtn.parentNode.replaceChild(newBtn, themeToggleBtn);
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        newBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
        document.body.classList.remove('dark-theme');
        newBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
    }
    
    newBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        let theme = 'light';
        if (document.body.classList.contains('dark-theme')) {
            theme = 'dark';
            newBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            newBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
        }
        localStorage.setItem('theme', theme);
    });
}

// Make it globally accessible for auth.js to call after modifying the navbar
window.initThemeToggle = initThemeToggle;

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
});
