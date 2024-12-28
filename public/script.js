const socket = io();

// Get references to DOM elements
const messages = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');

// Function to append a message to the chat
function appendMessage(msg, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(type);
    messageDiv.textContent = msg;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;  // Scroll to the latest message
}

// Send message when clicking the send button
sendBtn.addEventListener('click', () => {
    const msg = messageInput.value.trim();
    if (msg) {
        appendMessage(msg, 'sent');
        socket.emit('chat message', msg);  // Emit message to the server
        messageInput.value = '';  // Clear input field
    }
});

// Listen for messages from other users (from the server)
socket.on('chat message', (msg) => {
    appendMessage(msg, 'received');
});

// Typing indicator: Emit typing event only if the input changes
let typingTimeout;
messageInput.addEventListener('input', () => {
    clearTimeout(typingTimeout);  // Clear the previous timeout
    socket.emit('typing');  // Notify the server that the user is typing
    typingTimeout = setTimeout(() => {
        socket.emit('stop typing');  // Notify server to stop typing when user stops typing
    }, 1000); // Stop typing after 1 second of inactivity
});

// Show typing indicator when another user is typing
socket.on('typing', () => {
    typingIndicator.textContent = 'Someone is typing...';
});

// Stop typing indicator when the other user stops typing
socket.on('stop typing', () => {
    typingIndicator.textContent = '';
});

// Allow sending messages by pressing 'Enter'
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
