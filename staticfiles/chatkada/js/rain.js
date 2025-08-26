// Rain Effect JavaScript
function createRainEffect() {
    const rainContainer = document.getElementById('rain-container');
    if (!rainContainer) return;

    function createRainDrop() {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
        drop.style.opacity = Math.random();
        
        rainContainer.appendChild(drop);
        
        // Remove drop after animation
        setTimeout(() => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        }, 5000);
    }

    // Create rain drops continuously
    setInterval(createRainDrop, 100);
}

// Initialize rain effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    createRainEffect();
});
