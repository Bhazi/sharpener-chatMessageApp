var token = localStorage.getItem("token");
document.getElementById("submitChats").addEventListener("click", async () => {
  var inputBox = document.getElementById("userChats");
  var chatsFromUser = inputBox.value;

  await axios
    .post(
      "http://localhost:4001/chats",
      {
        chats: chatsFromUser,
      },
      { headers: { Authorization: token } }
    )
    .then((result) => {
      console.log(result.data);
      saveToLocalStorage(result.data);

      inputBox.value = "";
      setTimeout(() => {
        // Scroll to the bottom of the page
        const lastChild = userMessages.lastElementChild;
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 1000);
    })
    .catch((err) => console.log(err));
});

//for saving in localstorage
function saveToLocalStorage(data) {
  let myArray = JSON.parse(localStorage.getItem("myArray")) || [];

  let myObj = {
    userId: data.id,
    messageId: data.msgId,
    messages: data.message,
    user: {
      name: data.name,
    },
  };

  myArray.push(myObj);
  localStorage.setItem("myArray", JSON.stringify(myArray));
}

window.addEventListener("DOMContentLoaded", async () => {
  const div = document.getElementById("userMessages");
  // div.innerHTML = ""; // Clear existing messages
  setInterval(async () => {
    var localStorageArray = JSON.parse(localStorage.getItem("myArray")) || 0;
    try {
      if (localStorageArray.length > 30) {
        for (let i = 0; i <= 10; i++) {
          localStorageArray.shift();
          localStorage.setItem("myArray", JSON.stringify(localStorageArray));
        }
      } else if (
        localStorageArray[0].messageId > 25 &&
        localStorageArray != 0
      ) {
        localStorage.setItem("myArray", JSON.stringify(localStorageArray));

        var messageIdCount = localStorageArray[0].messageId;
        const result = await axios.get(
          `http://localhost:4001/message?messageCount=${messageIdCount}`,
          {
            headers: { Authorization: token },
          }
        );

        var newArrayList = result.data.messages.concat(localStorageArray);

        div.innerHTML = ""; // Clear existing messages
        newArrayList.forEach((element) => {
          showMessages(element.messages, element.user.name);
        });
      } else {
        div.innerHTML = ""; // Clear existing messages
        localStorageArray.forEach((element) => {
          showMessages(element.messages, element.user.name);
        });
      }
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
  span.textContent = data;
  span.id = "poiu";
  user.appendChild(span);
  div.appendChild(user);
}
