var token = localStorage.getItem("token");
document.getElementById("submitChats").addEventListener("click", async () => {
  location.reload();
  var chatsFromUser = document.getElementById("userChats").value;
  await axios
    .post(
      "http://localhost:4001/chats",
      {
        chats: chatsFromUser,
      },
      { headers: { Authorization: token } }
    )
    .then()
    .catch();
});

window.addEventListener("DOMContentLoaded", async () => {
    
  await axios
    .get("http://localhost:4001/message", {
      headers: { Authorization: token },
    })
    .then((result) => {
      //   console.log(result);
      result.data.messages.forEach((e) => {
        showMessages(e, e.user.name);
      });
    })
    .catch((err) => console.log(err));
});

function showMessages(data, name) {
  var div = document.getElementById("userMessages");
  var user = document.createElement("p");
  user.id = "spanMessage";
  user.textContent = `${name} : `;
  var span = document.createElement("span");
  span.textContent = data.messages;
  span.id = "poiu";
  user.appendChild(span);
  div.appendChild(user);
}


