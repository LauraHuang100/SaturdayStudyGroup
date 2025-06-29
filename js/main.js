// Import Google GenAI
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// DOM elements
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Gemini API Configuration
let genAI;
let chatModel;
let isApiReady = false;

// Navigation functionality
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Initialize Gemini API
async function initializeConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        if (!config.apiKey) {
            throw new Error('API key not found');
        }

        genAI = new GoogleGenerativeAI(config.apiKey);
        return true;
    } catch (error) {
        console.error('無法載入 API 配置:', error);
        addMessage('系統錯誤：無法載入 API 配置，請檢查 .env 文件。', false);
        messageInput.disabled = true;
        sendButton.disabled = true;
        return false;
    }
}

async function initializeGeminiAPI() {
    try {
        // 使用新的 API 格式初始化模型
        chatModel = genAI.getGenerativeModel({
            model: "gemini-pro"
        });
        
        // 發送測試消息以確認連接
        const testResponse = await chatModel.generateContent({
            contents: "Hello, please respond with 'Connection successful' if you can receive this message."
        });
        
        console.log("API Test Response:", await testResponse.response.text());
        isApiReady = true;
        addMessage('AI assistant is ready, welcome to start the conversation!', false);
        return true;
    } catch (error) {
        console.error('Gemini API initialization error:', error);
        addMessage('System error: Unable to connect to AI service, please check network connection or API key setting.', false);
        messageInput.disabled = true;
        sendButton.disabled = true;
        return false;
    }
}

// Message display function
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle sending messages
async function handleSendMessage() {
    if (!isApiReady) {
        addMessage('System not ready, please try again later.', false);
        return;
    }

    const message = messageInput.value.trim();
    if (!message) return;

    // Display user message
    addMessage(message, true);
    messageInput.value = '';
    
    // Disable input until response is received
    messageInput.disabled = true;
    sendButton.disabled = true;

    try {
        // Display loading status
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.innerHTML = '<div class="message-content">Thinking...</div>';
        chatMessages.appendChild(loadingDiv);

        // 使用新的 API 格式調用 Gemini
        const result = await chatModel.generateContent({
            contents: message,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        });
        
        // Remove loading status
        chatMessages.removeChild(loadingDiv);
        
        // Display AI response
        const response = await result.response;
        addMessage(response.text(), false);
    } catch (error) {
        console.error('Sending message error:', error);
        addMessage('Sorry, an error occurred. Please try again later.', false);
    } finally {
        // Re-enable input
        messageInput.disabled = false;
        sendButton.disabled = false;
    }
}

// Event listeners
sendButton.addEventListener('click', handleSendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

// Project data
const projects = [
    {
        title: '專案一',
        description: '這是一個使用React開發的網頁應用',
        image: 'project1.jpg',
        link: '#'
    },
    // You can add more projects here
];

// Dynamic project rendering
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" class="btn primary-btn">查看詳情</a>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

// Form submission processing
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        // You can add form submission logic here
        alert('訊息已送出！');
        contactForm.reset();
    });
}

// Initialize when the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    if (await initializeConfig()) {
        await initializeGeminiAPI();
    }
    renderProjects();
}); 