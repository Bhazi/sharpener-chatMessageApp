var token = localStorage.getItem("token");
// var token2 = localStorage.getItem("sendUser");
var token2 = null;
var forChat = null;

document.getElementById("submitChats").addEventListener("click", async () => {
  var inputBox = document.getElementById("userChats");
  var chatsFromUser = inputBox.value;

  await axios
    .post(
      `http://localhost:4001/chats?reciever=${token2}`,
      {
        chats: chatsFromUser,
        for: `${forChat}`,
      },
      { headers: { Authorization: token } }
    )
    .then((result) => {
      //   saveToLocalStorage(result.data);

      inputBox.value = "";
      setTimeout(() => {
        // Scroll to the bottom of the page
        const lastChild = userMessages.lastElementChild;
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 1000);
    })
    .catch((err) => console.log(err));
});

window.addEventListener("DOMContentLoaded", async () => {
  axios
    .get("http://localhost:4001/user/relationshipInScreen", {
      headers: { Authorization: token },
    })
    .then((result) => {
      console.log(result);
      result.data.re.forEach((data) => {
        showGroupChatOnScreenMain(data);
      });
      result.data.result.forEach((e) => {
        showPersonalChatUsersOnScreenMain(e.user);
      });
    })
    .catch((err) => console.log(err));
});

let intervalId = null;

function showGroupChatOnScreenMain(data) {
  console.log(data);
  var navBar = document.getElementById("navBar");
  var newwDiv = document.createElement("div");
  newwDiv.id = data.id;
  newwDiv.style.color = "white";
  newwDiv.className = "userNameDivMain";
  newwDiv.textContent = data.name;
  newwDiv.onclick = groupChatInterface;

  navBar.appendChild(newwDiv);
}

async function groupChatInterface() {
  forChat = "group";
  console.log(token2, "in first");
  if (intervalId != null) {
    clearInterval(intervalId);
  }
  token2 = this.id;
  var div = document.getElementById("userMessages");
  div.innerHTML = "";
  document.getElementById("userNameToChat").textContent = this.textContent;
  console.log("hello you clicked ", this.textContent);

  this.id = this.id;

  const msg = async () => {
    await axios
      .get(`http://localhost:4001/groupChatMessage?group_id=${this.id}`, {
        headers: { Authorization: token },
      })
      .then((resu) => {
        console.log(resu);
        const div = document.getElementById("userMessages");
        div.innerHTML = ""; // Clear existing messages
        // localStorage.setItem("sendUser", result.data.sendUser);
        resu.data.result.forEach((e) => {
          showMessagesForGrpChat(e, resu.data.sendUser);
        });
      });
  };

  intervalId = setInterval(() => {
    msg();
  }, 980);

  function showMessagesForGrpChat(data, user) {
    if (data.user.id == user) {
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      divvs.className = "endFlex";
      var userName = document.createElement("p");
      userName.className = "nameOfUsersInGrpEnnd";
      userName.textContent = data.user.username;
      var usertext = document.createElement("p");
      usertext.id = "spanMessageEndFlex";
      usertext.textContent = data.message;
      userName.appendChild(usertext);
      divvs.appendChild(userName);
      div.appendChild(divvs);
    } else {
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      divvs.className = "startFlex";
      var userName = document.createElement("p");
      userName.className = "nameOfUsersInGrpStarrt";
      userName.textContent = data.user.username;
      var usertext = document.createElement("p");
      usertext.id = "spanMessageStartFlex";
      usertext.textContent = data.message;
      userName.appendChild(usertext);
      divvs.appendChild(userName);
      div.appendChild(divvs);
    }
  }
}

//showing users in the Main Div when making relations
function showPersonalChatUsersOnScreenMain(e) {
  var navBar = document.getElementById("navBar");
  var newwDiv = document.createElement("div");
  newwDiv.id = e.id;
  newwDiv.style.color = "white";
  newwDiv.className = "userNameDivMain";
  newwDiv.textContent = e.username;

  navBar.appendChild(newwDiv);

  newwDiv.addEventListener("click", async () => {
    forChat = "personal";
    if (intervalId != null) {
      clearInterval(intervalId);
    }
    token2 = e.id;

    var div = document.getElementById("userMessages");
    div.innerHTML = "";
    document.getElementById("userNameToChat").textContent = e.username;

    async function msg() {
      await axios
        .get(`http://localhost:4001/messageChat?reciever_id=${e.id}`, {
          headers: { Authorization: token },
        })
        .then((result) => {
          const div = document.getElementById("userMessages");
          div.innerHTML = ""; // Clear existing messages
          result.data.messages.forEach((e) => {
            showMessages(e, result.data.user);
          });
        });
    }

    intervalId = setInterval(() => {
      console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      msg();
    }, 980);

    console.log("after setInterval");
  });
}

function showMessages(data, user) {
  if (data.sender_id == user) {
    var div = document.getElementById("userMessages");
    var divvs = document.createElement("div");
    divvs.className = "ennd";
    var user = document.createElement("p");
    user.id = "spanMessageEnd";
    user.textContent = data.message;
    divvs.appendChild(user);
    div.appendChild(divvs);
  } else {
    var div = document.getElementById("userMessages");
    var divvs = document.createElement("div");
    divvs.className = "starrt";
    var user = document.createElement("p");
    user.id = "spanMessageStart";
    user.textContent = data.message;
    divvs.appendChild(user);
    div.appendChild(divvs);
  }
}

//making functions when clicking the nav Button
document.getElementById("nav").addEventListener("click", async () => {
  var mainDiv = document.getElementById("chatTemp");
  var newNavDiv = document.createElement("div");
  newNavDiv.id = "navigation";
  newNavDiv.className = "navigation";
  var buttonForReverse = document.createElement("button");
  buttonForReverse.className = "reverseButton";
  buttonForReverse.id = "reverseButton";
  var imgg = document.createElement("img");
  imgg.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAoElEQVR4nO3Vva5BQRSA0alFqyQKohS0rvAGHsGTeMer0atEg8YtnGRJOOInUd59FPMlU0y1ksnMnpRyuVxEaKMWjS5Q4DcSnePsVgyMGf5KdIdeBNrHvkQPGESgXWxL9ISfCLSJjUdLjP5pte5oA2txFRhXB1dw1M30HDpvl2uSovL6nI4YRuLT8AHyYWSuUkWfxCoUfrrt9esml8t9axcfQ1CsrDDlJgAAAABJRU5ErkJggg==";

  buttonForReverse.appendChild(imgg);
  newNavDiv.appendChild(buttonForReverse);
  mainDiv.appendChild(newNavDiv);

  const createGrpDiv = newNavDiv.appendChild(document.createElement("div"));
  Object.assign(createGrpDiv, {
    className: "createGrp",
    id: "createGrp",
    textContent: "Create Group",
  });

  document.getElementById("createGrp").addEventListener("click", async () => {
    var mainDiv = document.getElementById("navigation"); // assuming mainDiv exists
    var createGrpDiv = document.createElement("div");
    createGrpDiv.className = "createGrpDiv";
    createGrpDiv.id = "createGrpDiv";
    var innerCreateGrpDiv = document.createElement("div");
    innerCreateGrpDiv.className = `innercreateGrpDiv`;
    var buttonForReversePersGrp = document.createElement("button");
    buttonForReversePersGrp.className = "reverseButtonInCreateGrp";
    buttonForReversePersGrp.id = "reverseButtonInCreateGrp";
    var image = document.createElement("img");
    image.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAoElEQVR4nO3Vva5BQRSA0alFqyQKohS0rvAGHsGTeMer0atEg8YtnGRJOOInUd59FPMlU0y1ksnMnpRyuVxEaKMWjS5Q4DcSnePsVgyMGf5KdIdeBNrHvkQPGESgXWxL9ISfCLSJjUdLjP5pte5oA2txFRhXB1dw1M30HDpvl2uSovL6nI4YRuLT8AHyYWSuUkWfxCoUfrrt9esml8t9axcfQ1CsrDDlJgAAAABJRU5ErkJggg==";

    var grpInput = document.createElement("input");
    grpInput.placeholder = "Group Name";
    grpInput.className = "grpInput";
    var grpSubmit = document.createElement("button");
    grpSubmit.textContent = "confirm";
    grpSubmit.id = "grpSubmit";
    grpSubmit.className = "grpSubmit";
    grpSubmit.type = "submit";

    buttonForReversePersGrp.appendChild(image);
    createGrpDiv.appendChild(buttonForReversePersGrp);
    innerCreateGrpDiv.appendChild(grpInput);
    innerCreateGrpDiv.appendChild(grpSubmit);
    createGrpDiv.appendChild(innerCreateGrpDiv);
    mainDiv.appendChild(createGrpDiv);

    document
      .getElementById("reverseButtonInCreateGrp")
      .addEventListener("click", () => {
        var navDiv = document.querySelector(".createGrpDiv");
        navDiv.classList.toggle("slide-out");
        setTimeout(() => navDiv.remove(), 500);
      });

    var usersMainDiv = document.createElement("div");
    usersMainDiv.className = "mainDivUsersCreateGrp";
    usersMainDiv.textContent = "Users";
    createGrpDiv.appendChild(usersMainDiv);

    const result = await axios.get("http://localhost:4001/createGrpUsers", {
      headers: { Authorization: token },
    });

    result.data.e.forEach((e) => {
      if (e.id == result.data.user) return;
      else showUsersOnCreateGrpScreen(e);
    });

    function showUsersOnCreateGrpScreen(data) {
      var newwDiv = document.createElement("div");
      newwDiv.id = data.id;
      newwDiv.className = "userNamesOnCreateGrp";
      newwDiv.textContent = data.username;
      newwDiv.onclick = toggleActiveClass;
      usersMainDiv.appendChild(newwDiv);
    }

    var values = [];

    function toggleActiveClass() {
      this.classList.toggle("active");
      if (this.classList.contains("active")) {
        values.push(this.id);
      } else {
        values.pop();
      }
    }

    document.getElementById("grpSubmit").addEventListener("click", function () {
      const groupName = document.getElementsByClassName("grpInput")[0].value;

      axios.post(
        "http://localhost:4001/user/createGrpUsers",
        {
          groupName: groupName,
          array: values,
        },
        { headers: { Authorization: token } }
      );

      window.location.href = "http://localhost:4001/chatPage/chatPage.html";
    });
  });

  //

  const createPersonalMsgDiv = newNavDiv.appendChild(
    document.createElement("div")
  );
  Object.assign(createPersonalMsgDiv, {
    className: "createPersMsg",
    id: "createPersMsg",
    textContent: "Start Personal Message",
  });

  //clicking personal message divs
  document
    .getElementById("createPersMsg")
    .addEventListener("click", async () => {
      var maiDiv = document.getElementById("navigation");
      var newPersMsgDiv = document.createElement("div");
      newPersMsgDiv.className = "personalMsgNav";
      var buttonForReversePersMsg = document.createElement("button");
      buttonForReversePersMsg.className = "reverseButtonInPersMsg";
      buttonForReversePersMsg.id = "reverseButtonInPersMsg";
      var imggg = document.createElement("img");
      imggg.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAoElEQVR4nO3Vva5BQRSA0alFqyQKohS0rvAGHsGTeMer0atEg8YtnGRJOOInUd59FPMlU0y1ksnMnpRyuVxEaKMWjS5Q4DcSnePsVgyMGf5KdIdeBNrHvkQPGESgXWxL9ISfCLSJjUdLjP5pte5oA2txFRhXB1dw1M30HDpvl2uSovL6nI4YRuLT8AHyYWSuUkWfxCoUfrrt9esml8t9axcfQ1CsrDDlJgAAAABJRU5ErkJggg==";

      buttonForReversePersMsg.appendChild(imggg);
      newPersMsgDiv.appendChild(buttonForReversePersMsg);
      maiDiv.appendChild(newPersMsgDiv);

      const result = await axios.get(`http://localhost:4001/hello`, {
        headers: { Authorization: token },
      });

      result.data.e.forEach((e) => {
        if (e.id == result.data.user) return;
        else showUsersOnScreen(e);
      });

      function showUsersOnScreen(e) {
        var newwDiv = document.createElement("div");
        newwDiv.id = e.id;
        newwDiv.className = "userNameDiv";
        newwDiv.textContent = e.username;

        newPersMsgDiv.appendChild(newwDiv);

        // add event listener to each userNameDiv element
        newwDiv.addEventListener("click", async () => {
          await axios
            .post(
              "http://localhost:4001/user/relationship",
              {
                relatedFriendId: e.id,
              },
              { headers: { Authorization: token } }
            )
            .then((result) => console.log(result));
        });
      }

      document
        .getElementById("reverseButtonInPersMsg")
        .addEventListener("click", () => {
          var navDiva = document.querySelector(".personalMsgNav");
          navDiva.classList.toggle("slide-out");
          setTimeout(() => navDiva.remove(), 500);
        });
    });

  // when user click the reverse button
  document.getElementById("reverseButton").addEventListener("click", () => {
    var navDiv = document.querySelector(".navigation");
    navDiv.classList.toggle("slide-out");
    setTimeout(() => navDiv.remove(), 500);
  });
});
