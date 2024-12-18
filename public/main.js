// To connect to the web socxket server in application.js we created this
//yha sara client side ka kaam hoga aur app pr sara server side kja
const { formatDistanceToNow } = require('date-fns');

const timestamp = '2024-12-17T15:30:00.000Z'; // Example ISO timestamp
const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

console.log(`This happened ${timeAgo}`);
// const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true})

const socket = io();

const clientsTotal = document.getElementById('clients-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault(); // otherwise it would reload the page
    sendMessage();
});

socket.on('clients-total', (data) => {  // we are handling the event: clients total over here 
    console.log(data);
    clientsTotal.innerText = `Total Clients: ${data}`; // This will update total client on the client side
});

function sendMessage() {
    // console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    };

    socket.emit('message', data);
    addMessageToUI(true, data);
}

socket.on('chat-message', (data) => {
    console.log(data);
    addMessageToUI(false, data);
    messageInput.value = '';
});

function addMessageToUI(isOwnMessage, data) {
    const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
                        <p class="message">${data.message}</p>
                        <span> ${data.name} ⚫ ${formatDistanceToNow(new Date(data.dateTime))} ago</span>
                    </li>`;
    messageContainer.innerHTML += element;
}
