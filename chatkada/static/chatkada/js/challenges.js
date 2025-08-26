// Challenge tracking and coin progress system
class ChallengeTracker {
    constructor() {
        this.init();
    }
    
    init() {
        this.updateCoinProgress();
        this.checkDailyLogin();
        
        // Update progress every 30 seconds
        setInterval(() => {
            this.updateCoinProgress();
        }, 30000);
    }
    
    updateCoinProgress() {
        fetch('/get-coin-progress/')
            .then(response => response.json())
            .then(data => {
                // Update coin amount
                document.getElementById('coin-amount').textContent = data.total_coins;
                
                // Update daily login indicator
                const loginIndicator = document.getElementById('login-indicator');
                if (data.daily_login_completed) {
                    loginIndicator.classList.add('completed');
                    loginIndicator.innerHTML = '<i class="fas fa-check-circle"></i>';
                } else {
                    loginIndicator.classList.remove('completed');
                    loginIndicator.innerHTML = '<i class="fas fa-calendar-check"></i>';
                }
                
                // Update friends challenge progress
                const friendsIndicator = document.getElementById('friends-indicator');
                const friendsCount = document.getElementById('friends-count');
                
                friendsCount.textContent = data.friends_progress;
                
                if (data.friends_challenge_completed) {
                    friendsIndicator.classList.add('completed');
                    friendsIndicator.innerHTML = '<i class="fas fa-check-circle"></i> 5/5';
                } else {
                    friendsIndicator.classList.remove('completed');
                    const percentage = (data.friends_progress / 5) * 100;
                    friendsIndicator.style.background = `linear-gradient(90deg, #4CAF50 ${percentage}%, transparent ${percentage}%)`;
                }
            })
            .catch(error => console.error('Error updating coin progress:', error));
    }
    
    checkDailyLogin() {
        // Check daily login on page load
        fetch('/check-daily-login/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showCoinNotification(data.message, data.coins_earned);
                this.updateCoinProgress();
            }
        })
        .catch(error => console.error('Error checking daily login:', error));
    }
    
    recordChatFriend(friendUsername) {
        fetch('/record-chat-friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                friend_username: friendUsername
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.updateCoinProgress();
                
                if (data.challenge_completed) {
                    this.showCoinNotification(data.message, data.coins_earned);
                } else {
                    this.showProgressNotification(data.message);
                }
            }
        })
        .catch(error => console.error('Error recording chat friend:', error));
    }
    
    showCoinNotification(message, coinsEarned) {
        const notification = document.createElement('div');
        notification.className = 'coin-notification success';
        notification.innerHTML = `
            <i class="fas fa-coins"></i>
            <span>${message}</span>
            <div class="coin-amount">+${coinsEarned}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
    
    showProgressNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'coin-notification info';
        notification.innerHTML = `
            <i class="fas fa-user-friends"></i>
            <span>${message}</span>
        `;
        
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
}

// Utility function for CSRF token
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

// Initialize challenge tracker
document.addEventListener('DOMContentLoaded', () => {
    window.challengeTracker = new ChallengeTracker();
});

// Integration with existing chat system
// Call this when user starts chatting with a new stranger
function onNewStrangerChat(strangerUsername) {
    if (window.challengeTracker) {
        window.challengeTracker.recordChatFriend(strangerUsername);
    }
}
