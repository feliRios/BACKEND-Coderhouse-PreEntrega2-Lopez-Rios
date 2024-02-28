const socket = io();

socket.on("connection", (data) => {
  console.log(data);
  render(data);
})

socket.on("postedMessage", (data) => {
  console.log(data);
  render(data);
})

function addMessage(){
  const message = {
    user: document.getElementById("msg-user").value,
    text: document.getElementById("msg-content").value
  }
  socket.emit('newMessage', message);
  return false;
}

function render(messages){
  const html = messages.map((el) => {
    return (
      `
        <div class="chat__message">
          <strong style="display: block;">${el.user}</strong>
          <p>${el.message}</p>
        </div>
      `
    )
  }).join(' ');
  let chat = document.querySelector(".chat");
  chat.innerHTML = html;
  chat.scrollTop = chat.scrollHeight;
}