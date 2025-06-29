// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendText');
const voiceButton = document.getElementById('startVoice');

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'zh-TW';
recognition.continuous = false;
recognition.interimResults = false;

// Chat History
let chatHistory = [];

// Event Listeners
sendButton.addEventListener('click', handleSendMessage);
voiceButton.addEventListener('click', toggleVoiceRecognition);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

// Voice Recognition Events
recognition.onstart = () => {
    voiceButton.innerHTML = '<i class="fas fa-stop"></i>';
    voiceButton.classList.add('recording');
};

recognition.onend = () => {
    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceButton.classList.remove('recording');
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    handleSendMessage();
};

// Handle Send Message
async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);
    userInput.value = '';

    // TODO: Replace this with actual Gemini API call
    // For now, we'll use a placeholder response
    const aiResponse = "這是一個示例回應。當您整合 Gemini API 後，這裡將顯示真實的 AI 回應。";
    
    // Add AI response to chat
    setTimeout(() => {
        addMessageToChat('ai', aiResponse);
    }, 1000);
}

// Add Message to Chat
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat history
    chatHistory.push({ sender, message });
}

// Toggle Voice Recognition
function toggleVoiceRecognition() {
    if (voiceButton.classList.contains('recording')) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// Initialize Chat
function initializeChat() {
    addMessageToChat('ai', '你好！我是你的 AI 助手。有什麼我可以幫你的嗎？');
}

// Start the chat
initializeChat(); 