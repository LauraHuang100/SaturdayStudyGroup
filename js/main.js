// Import the Google GenAI library
import { GoogleGenAI } from "@google/genai";

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendText');
const voiceButton = document.getElementById('startVoice');
const maximizeButton = document.getElementById('maximizeChat');
const chatSection = document.getElementById('ai-chat');

// Initialize Gemini AI with API key
const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

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
maximizeButton.addEventListener('click', toggleChatMaximize);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

// Maximize/Minimize Chat
function toggleChatMaximize() {
    chatSection.classList.toggle('maximized');
    const icon = maximizeButton.querySelector('i');
    if (chatSection.classList.contains('maximized')) {
        icon.classList.remove('fa-expand');
        icon.classList.add('fa-compress');
    } else {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
    }
}

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

    try {
        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';

        // Show loading indicator
        const loadingMessage = addMessageToChat('ai', '思考中...');
        
        // Call Gemini API
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message
        });

        // Remove loading message
        loadingMessage.remove();
        
        // Add AI response to chat
        const aiResponse = response.text;
        addMessageToChat('ai', aiResponse);
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        let errorMessage = '抱歉，我現在無法回應。';
        
        if (error.message.includes('API key')) {
            errorMessage += ' API key 可能無效或未正確設置。';
        } else if (error.status === 404) {
            errorMessage += ' API 服務可能未啟用。請確保在 Google Cloud Console 中啟用了 Gemini API。';
        } else if (error.status === 403) {
            errorMessage += ' 沒有權限訪問 API。請檢查 API key 的權限設置。';
        }
        
        addMessageToChat('ai', errorMessage);
    }
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
    
    return messageDiv; // Return the message element for potential removal (loading indicator)
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
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
        addMessageToChat('ai', '警告：API key 未設置。請在 .env 文件中設置有效的 VITE_GEMINI_API_KEY。');
        return;
    }
    addMessageToChat('ai', '你好！我是你的 AI 助手。有什麼我可以幫你的嗎？');
}

// Start the chat
initializeChat(); 