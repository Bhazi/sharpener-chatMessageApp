var token = localStorage.getItem("token");
document.getElementById("submitChats").addEventListener("click", async () => {
  var inputBox = document.getElementById("userChats");
  // var chatsFromUser = document.getElementById("userChats").value;
  var chatsFromUser = inputBox.value;
  await axios
    .post(
      "http://localhost:4001/chats",
      {
        chats: chatsFromUser,
      },
      { headers: { Authorization: token } }
    )
    .then(() => {
      // chatsFromUser.value = "";
      inputBox.value = "";
      setTimeout(() => {
        // Scroll to the bottom of the page
        const lastChild = userMessages.lastElementChild;
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 1000);
    })
    .catch();
});

window.addEventListener("DOMContentLoaded", async () => {
  const div = document.getElementById("userMessages");
  // div.innerHTML = ""; // Clear existing messages

  setInterval(async () => {
    try {
      const result = await axios.get("http://localhost:4001/message", {
        headers: { Authorization: token },
      });
      div.innerHTML = ""; // Clear existing messages
      result.data.messages.forEach((e) => {
        showMessages(e, e.user.name);
      });
    } catch (err) {
      console.log(err);
    }
  }, 850);
});

function showMessages(data, name) {
  var div = document.getElementById("userMessages");
  var user = document.createElement("p");
  user.id = "spanMessage";
  user.textContent = `${name} : `;
  var span = document.createElement("p");
  span.textContent = data.messages;
  span.id = "poiu";
  user.appendChild(span);
  div.appendChild(user);
}
