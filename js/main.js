// Import Google GenAI
import { GoogleGenerativeAI } from "@google/generative-ai";

// DOM elements
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Gemini API Configuration
const GEMINI_API_KEY = 'YOUR_API_KEY'; // Please replace with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initialize Gemini API
let chatModel;

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
async function initializeGeminiAPI() {
    try {
        chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        return true;
    } catch (error) {
        console.error('Gemini API initialization error:', error);
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
    const message = messageInput.value.trim();
    if (!message) return;

    // Display user message
    addMessage(message, true);
    messageInput.value = '';

    try {
        // Display loading status
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.innerHTML = '<div class="message-content">思考中...</div>';
        chatMessages.appendChild(loadingDiv);

        // Call Gemini API
        const result = await chatModel.generateContent(message);
        const response = await result.response;
        
        // Remove loading status
        chatMessages.removeChild(loadingDiv);
        
        // Display AI response
        addMessage(response.text(), false);
    } catch (error) {
        console.error('Sending message error:', error);
        addMessage('抱歉，發生錯誤。請稍後再試。', false);
    }
}

// Event listeners
sendButton.addEventListener('click', handleSendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
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
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    // You can add form submission logic here
    alert('訊息已送出！');
    contactForm.reset();
});

// Initialize when the page is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await initializeGeminiAPI();
    renderProjects();
}); 