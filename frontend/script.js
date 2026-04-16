let chats = JSON.parse(localStorage.getItem("chats")) || {};
let currentChatId = null;

function saveChats() {
    localStorage.setItem("chats", JSON.stringify(chats));
}

function newChat() {
    currentChatId = "chat-" + Date.now();
    chats[currentChatId] = {
        title: "New Chat",
        messages: []
    };
    document.getElementById("chat-box").innerHTML = "";
    saveChats();
    renderChatList();
}

function renderChatList() {
    let chatList = document.getElementById("chat-list");
    chatList.innerHTML = "";

    Object.keys(chats).forEach(id => {
        let div = document.createElement("div");
        div.className = "chat-item";

        div.innerHTML = `
            <span onclick="loadChat('${id}')">${chats[id].title}</span>
            <button onclick="deleteChat('${id}')" class="delete-btn">❌</button>
        `;

        div.ondblclick = () => renameChat(id);

        chatList.appendChild(div);
    });
}

function renameChat(id) {
    let newName = prompt("Enter new chat name:");
    if (newName) {
        chats[id].title = newName;
        saveChats();
        renderChatList();
    }
}

function deleteChat(id) {
    if (confirm("Delete this chat?")) {
        delete chats[id];

        if (currentChatId === id) {
            document.getElementById("chat-box").innerHTML = "";
            currentChatId = null;
        }

        saveChats();
        renderChatList();
    }
}

function loadChat(id) {
    currentChatId = id;
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    chats[id].messages.forEach(msg => {
        chatBox.innerHTML += `
        <div class="message ${msg.role}">
            <img src="user.png" class="avatar">
            <div class="bubble">${msg.text}</div>
        </div>
        `;
    });
}

async function sendMessage() {
    let input = document.getElementById("user-input");
    let chatBox = document.getElementById("chat-box");

    let userText = input.value;
    if (!userText) return;

    if (!currentChatId) newChat();

    let chat = chats[currentChatId];

    if (chat.messages.length === 0) {
        chat.title = userText.substring(0, 20);
    }

    chat.messages.push({ role: "user", text: userText });

    chatBox.innerHTML += `
    <div class="message user">
        <div class="bubble">${userText}</div>
        <img src="user.png" class="avatar">
    </div>
    `;

    let typingId = "typing-" + Date.now();
    chatBox.innerHTML += `
    <div class="message bot" id="${typingId}">
        <img src="user.png" class="avatar">
        <div class="bubble typing">Typing...</div>
    </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        let response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: userText })
        });

        let data = await response.json();

        chat.messages.push({ role: "bot", text: data.response });

        document.getElementById(typingId).innerHTML = `
            <img src="user.png" class="avatar">
            <div class="bubble">${data.response}</div>
        `;

    } catch (error) {
        document.getElementById(typingId).innerHTML = `
            <div class="bubble" style="color:red;">Error</div>
        `;
    }

    input.value = "";
    saveChats();
    renderChatList();
}

window.onload = function () {
    renderChatList();

    let keys = Object.keys(chats);
    if (keys.length > 0) {
        loadChat(keys[0]);
    }
};