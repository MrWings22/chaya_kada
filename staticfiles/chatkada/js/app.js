// Main App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sound controls
    const soundToggle = document.getElementById('sound-toggle');
    const ambientSound = document.getElementById('ambient-sound');
    let soundEnabled = false;

    if (soundToggle) {
        soundToggle.addEventListener('click', function() {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                ambientSound.play();
                soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            } else {
                ambientSound.pause();
                soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            }
        });
    }

    // Initialize rain effect
    createRainEffect();

    // Auto-play ambient sound (muted by default)
    if (ambientSound) {
        ambientSound.volume = 0.3;
        ambientSound.muted = true;
    }
});

// Utility functions
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Set up CSRF token for all AJAX requests
const csrftoken = getCookie('csrftoken');

function setupCSRF() {
    const xhr = new XMLHttpRequest();
    xhr.setRequestHeader('X-CSRFToken', csrftoken);
    return xhr;
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loading.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 12px;
        z-index: 9999;
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        document.body.removeChild(loading);
    }
}

// Thunder effect
function createThunderEffect() {
    const thunder = document.createElement('div');
    thunder.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.2);
        pointer-events: none;
        z-index: 999;
        opacity: 0;
    `;
    document.body.appendChild(thunder);
    
    // Flash effect
    thunder.style.opacity = '1';
    setTimeout(() => {
        thunder.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(thunder);
        }, 200);
    }, 100);
}

// Random thunder every 30-60 seconds
setInterval(() => {
    if (Math.random() < 0.3) {
        createThunderEffect();
    }
}, 45000);
