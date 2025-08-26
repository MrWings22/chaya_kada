// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    
    let isPolling = false;

    // Send message function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        sendButton.disabled = true;
        sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        fetch('/send-message/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageInput.value = '';
                appendMessage(data.message, true);
                scrollToBottom();
            } else {
                showNotification('Failed to send message', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error sending message', 'error');
        })
        .finally(() => {
            sendButton.disabled = false;
            sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
        });
    }

    // Append message to chat
    function appendMessage(messageData, isOwn = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isOwn ? 'own' : ''}`;
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="username">${messageData.user}</span>
                <span class="timestamp">${messageData.timestamp}</span>
            </div>
            <div class="message-content">${messageData.message}</div>
        `;
        chatMessages.appendChild(messageDiv);
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Poll for new messages
    function pollMessages() {
        if (isPolling) return;
        isPolling = true;

        fetch('/get-messages/')
        .then(response => response.json())
        .then(data => {
            // This is a simple implementation - in production, you'd want to track
            // the last message ID and only append new messages
            if (data.messages && data.messages.length > 0) {
                // For now, just update if there are new messages
                // In a real app, you'd want to implement proper message tracking
            }
        })
        .catch(error => {
            console.error('Error polling messages:', error);
        })
        .finally(() => {
            isPolling = false;
        });
    }

    // Event listeners
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Poll for new messages every 5 seconds
    setInterval(pollMessages, 5000);

    // Scroll to bottom on load
    scrollToBottom();
});

document.getElementById('find-stranger-form').addEventListener('submit', function(e) {
    e.preventDefault(); // <<< Prevents full page reload!

    fetch("{% url 'find_stranger_chat' %}", {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie('csrftoken'),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "action=find_stranger"
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'matched') {
            window.location.href = `/chat/${data.room_id}/`;
        } else if (data.status === 'waiting') {
            // Show waiting animation/UI
        } else {
            // Handle 'no_users', 'timeout', etc
        }
    })
    .catch(() => {
        alert("Connection issue detected.");
    });
});

function getCookie(name) {
    // CSRF helper as before...
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

