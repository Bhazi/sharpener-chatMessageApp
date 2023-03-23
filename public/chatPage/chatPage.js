var token = localStorage.getItem("token");
var token2 = null;
var forChat = null;
var admin = null;
let usssse = null;

var socket = io();

document.getElementById("submitChats").addEventListener("click", async () => {
  var inputBox = document.getElementById("userChats");
  var chatsFromUser = inputBox.value;
  // socket.emit("new-data", chatsFromUser);
  socket.emit("new-data", forChat);
  await axios
    .post(
      `http://localhost:4001/chats?reciever=${token2}`,
      {
        chats: chatsFromUser,
        for: `${forChat}`,
      },
      { headers: { Authorization: token } }
    )
    .then(() => {
      inputBox.value = "";
      setTimeout(() => {
        // Scroll to the bottom of the page
        const lastChild = userMessages.lastElementChild;
        lastChild.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 1500);
    })
    .catch((err) => console.log(err));
});

window.addEventListener("DOMContentLoaded", async () => {
  await axios
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

let currentNewwDiv = null; // keeps track of the currently selected group ID

function showGroupChatOnScreenMain(data) {
  var navBar = document.getElementById("navBar");
  var newwDiv = document.createElement("div");
  newwDiv.id = data.id;
  newwDiv.style.color = "white";
  newwDiv.className = "userNameDivMain";
  newwDiv.textContent = data.name;
  newwDiv.onclick = (event) => {
    groupChatInterface(event.target);
  };
  navBar.appendChild(newwDiv);
}

socket.on("aaaaaa", function (forchat) {
  if (forchat == "group") {
    setTimeout(() => {
      // groupChatInterface(currentNewwDiv);
      msg(currentNewwDiv);
    }, 530);
  }
});

function groupChatInterface(data) {
  //input text area and user message height setting
  document.querySelector(".inputAndSubmit").style.display = "block";
  document.querySelector(".userMessages").style.height = "523px";

  currentNewwDiv = data;
  forChat = "group";
  token2 = data.id;

  var div = document.getElementById("userMessages");
  div.innerHTML = "";
  document.getElementById("userNameToChat").textContent = data.textContent;
  msg(data);
}

const msg = async (data) => {
  try {
    await axios
      .get(`http://localhost:4001/groupChatMessage?group_id=${data.id}`, {
        headers: { Authorization: token },
      })
      .then((resu) => {
        console.log(resu);
        admin = resu.data.admin.admin;
        const div = document.getElementById("userMessages");
        div.innerHTML = ""; // Clear existing messages
        // localStorage.setItem("sendUser", result.data.sendUser);
        // resu.data.data.forEach((e) => {
        //   console.log(e);
        // });
        resu.data.data.forEach((e) => {
          showMessagesForGrpChat(e, resu.data.sendUser);
        });
      });
  } catch (error) {
    console.error(error);
  }

  function showMessagesForGrpChat(data, user) {
    if (data.type == "message") {
      // console.log("data is", data.user.id, data.message, "and user is ", user);
      if (data.user.id == user) {
        var div = document.getElementById("userMessages");
        var divvs = document.createElement("div");
        divvs.className = "endFlex";
        var userName = document.createElement("p");
        userName.className = "nameOfUsersInGrpEnnd";
        // userName.textContent = data.user.username;
        var usertext = document.createElement("p");
        usertext.id = "spanMessageEndFlex";
        usertext.textContent = data.message;
        userName.appendChild(usertext);
        divvs.appendChild(userName);
        div.appendChild(divvs);
        usssse = data.user.username;
      } else {
        var div = document.getElementById("userMessages");
        var divvs = document.createElement("div");
        divvs.className = "startFlex";
        var userName = document.createElement("p");
        userName.className = "nameOfUsersInGrpStarrt";
        if (data.user.username == usssse) {
          usssse = data.user.username;
        } else if (usssse != data.user.username || usssse == null) {
          usssse = data.user.username;
          usssse = data.user.username;
          userName.textContent = data.user.username;
        }

        var usertext = document.createElement("p");
        usertext.id = "spanMessageStartFlex";
        usertext.textContent = data.message;
        userName.appendChild(usertext);
        divvs.appendChild(userName);
        div.appendChild(divvs);
      }
    } else if (data.type == "image") {
      if (data.data.sender_id == user) {
        var div = document.getElementById("userMessages");
        var divvs = document.createElement("div");
        divvs.className = "endFlexImage";
        let buffer = data.data.data.data;
        let binary = "";
        let bytes = new Uint8Array(buffer);

        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        let base64 = window.btoa(binary);
        // console.log(base64);

        let img = document.createElement("img");
        img.src = "data:image/jpeg;base64," + base64;
        img.id = "imagesInGrp";
        img.className = "imagesInGrp";
        divvs.appendChild(img);
        div.appendChild(divvs);
        usssse = data.data.sender.username;
      } else {
        // console.log(data.data.sender.username);
        var div = document.getElementById("userMessages");
        var divvs = document.createElement("div");
        if (data.data.sender.username != usssse || usssse == null) {
          usssse = data.data.sender.username;
          divvs.textContent = `${data.data.sender.username}`;
        }
        // divvs.className = "startFlexImage";
        divvs.className = "startFlexImage";
        divvs.id = `${data.data.sender.username}`;
        let buffer = data.data.data.data;
        let binary = "";
        let bytes = new Uint8Array(buffer);

        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        let base64 = window.btoa(binary);
        // console.log(base64);

        let img = document.createElement("img");
        img.src = "data:image/jpeg;base64," + base64;
        img.id = "imagesInGrpStart";
        img.className = "imagesInGrpStart";
        divvs.appendChild(img);
        div.appendChild(divvs);
      }
    } else {
      if (data.data.sender_id == user) {
        var div = document.getElementById("userMessages");
        var divvs = document.createElement("div");
        divvs.className = "endFlexDocument";
        let buffer = data.data.data.data;
        let binary = "";
        let bytes = new Uint8Array(buffer);

        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        let base64 = window.btoa(binary);
        const filename = data.data.filename;
        const icon = getIconForFile(filename);
        const fileLink = document.createElement("a");
        fileLink.className = "documentsInGrp";
        fileLink.onclick = basimsw;
        fileLink.innerHTML = `<i class="${icon}"></i> ${filename}`;
        divvs.appendChild(fileLink);
        div.appendChild(divvs);

        function basimsw() {
          // create anchor element and click it programmatically
          // const link = document.createElement("a");
          fileLink.setAttribute(
            "href",
            `data:${data.data.filetype};base64,` + base64
            //   `data:application/octet-stream;base64,` + base64
          );
          fileLink.setAttribute(
            "href",
            "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
              base64
          );

          fileLink.setAttribute("download", `${filename}`);
          // link.setAttribute("download", "file.pdf");
        }
        usssse = data.data.sender.username;
      } else {
        var div = document.getElementById("userMessages");
        var divvs = document.createElement("div");
        if (data.data.sender.username != usssse || usssse == null) {
          usssse = data.data.sender.username;
          divvs.textContent = `${data.data.sender.username}`;
        }
        divvs.className = "startFlexDocument";
        let buffer = data.data.data.data;
        let binary = "";
        let bytes = new Uint8Array(buffer);

        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        //
        let base64 = window.btoa(binary);

        const filename = data.data.filename;
        const icon = getIconForFile(filename);
        const fileLink = document.createElement("a");
        fileLink.className = "documentsInGrpStart";
        fileLink.onclick = basimsw;
        fileLink.innerHTML = `<i class="${icon}"></i> ${filename}`;
        divvs.appendChild(fileLink);
        div.appendChild(divvs);

        function basimsw() {
          // create anchor element and click it programmatically
          // const link = document.createElement("a");
          fileLink.setAttribute(
            "href",
            `data:${data.data.filetype};base64,` + base64
            //   `data:application/octet-stream;base64,` + base64
          );
          fileLink.setAttribute(
            "href",
            "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
              base64
          );

          fileLink.setAttribute("download", `${filename}`);
          // link.setAttribute("download", "file.pdf");
        }
      }
    }
  }
  //Menu options for only group chat
  var adminOption = document.querySelector(".adminOption");

  // If adminOption button does not exist, create it
  if (!adminOption) {
    var adminOption = document.getElementById("userName");
    var buttonForAdmin = document.createElement("button");
    buttonForAdmin.onclick = adminOptions;
    buttonForAdmin.className = "adminOption";
    buttonForAdmin.id = "adminOption";
    var imageOption = document.createElement("img");
    imageOption.className = "optionMenu";
    imageOption.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVR4nO3TMQ6AIBBE0a24unhPF47xjdHKkKyJS8W8koKfQMbsA6AAO9AAB+p1Zlm4L3yrmYE2CPTMgA8Cx+wn2jID5Yn4lE+WEBpaBA1NfkNDi7D00E6AOpUl4DkexAAAAABJRU5ErkJggg==";

    buttonForAdmin.appendChild(imageOption);
    adminOption.appendChild(buttonForAdmin);
  }

  async function adminOptions() {
    var adminOption = document.body;
    const adminDiv = document.createElement("div");
    adminDiv.className = "adminDiv";
    adminDiv.id = "adminDiv";
    adminOption.appendChild(adminDiv);

    //members option in menu (Group)
    const membersInGrp = Object.assign(document.createElement("div"), {
      className: "membersInGrp",
      id: "membersInGrp",
      style: "color: white;",
      textContent: "Members",
    });
    adminDiv.appendChild(membersInGrp);
    membersInGrp.onclick = membersInGrpaa;

    if (admin == true) {
      const addMembers = Object.assign(document.createElement("div"), {
        className: "addMembersInGrp",
        id: "addMembersInGrp",
        style: "color: white;",
        textContent: "Add members",
      });

      adminDiv.appendChild(addMembers);
      addMembers.onclick = addMembersForGrp;
    }
  }

  async function membersInGrpaa() {
    var mainPPPP = document.getElementById("adminDiv");
    const membersInGrpList = Object.assign(document.createElement("div"), {
      className: "membersInGrpList",
      id: "membersInGrpList",
      style: "color: white;",
    });
    mainPPPP.appendChild(membersInGrpList);
    //checking the user admin or not to implement add users option
    const result = await axios.get(
      `http://localhost:4001/user/groupMembers?groupiId=${token2}`,
      {
        headers: { Authorization: token },
      }
    );

    result.data.users.forEach((data) => {
      showMemebersInOptions(data, result.data.sendUser);
    });
  }

  function showMemebersInOptions(data, user) {
    var mainPPPP = document.getElementById("membersInGrpList");
    const membersInGrpListDiv = Object.assign(document.createElement("li"), {
      className: "membersInGrpListDiv",
      id: `membersInGrpListDiv${data.user_id}`,
      style: "color: white;",
      style: "list-style-type: none;",
      textContent: `${data.users.username}`,
    });

    if (data.admin == true && data.users.id == user) {
      membersInGrpListDiv.textContent = `You - admin`;
      membersInGrpListDiv.classList.add("admin"); // add "admin" class to the element
    } else if (data.users.id == user) {
      membersInGrpListDiv.textContent = `You`;
    } else if (data.admin == true) {
      membersInGrpListDiv.textContent = `${data.users.username} - admin`;
      membersInGrpListDiv.classList.add("admin"); // add "admin" class to the element
    }
    mainPPPP.appendChild(membersInGrpListDiv);

    membersInGrpListDiv.onclick = function (event) {
      var id = this.id;
      if (admin) {
        if (!this.classList.contains("admin")) {
          var removeMember = document.getElementById(`removeMember ${this.id}`);
          var makeAdminMember = document.getElementById(
            `makeAdminMember ${this.id}`
          );
          if (removeMember && makeAdminMember) {
            mainPPPP.removeChild(removeMember);
            mainPPPP.removeChild(makeAdminMember);
          } else {
            var optionsForRemove = Object.assign(document.createElement("li"), {
              className: `removeMember`,
              id: `removeMember ${this.id}`,
              style:
                "color: white; display: inline-block; list-style-type: none;",
              textContent: `Remove`,
            });
            //making click function for remove button in group chat members
            optionsForRemove.onclick = async function () {
              const removeMemberResult = await axios.delete(
                `http://localhost:4001/user/${data.user_id}/${token2}`
              );
              if (removeMemberResult.data.success == "success") {
                document.getElementById(id).style.display = "none";
                document.getElementById(`makeAdminMember ${id}`).remove();
                document.getElementById(`removeMember ${id}`).remove();
              }
            };

            mainPPPP.insertBefore(optionsForRemove, this.nextSibling);

            var optionsForMakeAdmin = Object.assign(
              document.createElement("li"),
              {
                className: "makeAdminMember",
                id: `makeAdminMember ${this.id}`,
                style:
                  "color: white; display: inline-block; list-style-type: none;",
                textContent: `Make Admin`,
              }
            );
            //making click function for remove button in group chat members
            optionsForMakeAdmin.onclick = async function () {
              const makeAdminResult = await axios.put(
                `http://localhost:4001/user/makeAdmin?userId=${data.user_id}&groupId=${token2}`
              );
              if (makeAdminResult.data.success == "success") {
                membersInGrpListDiv.classList.add("admin");
                membersInGrpListDiv.textContent = `${data.users.username} - admin`;

                document.getElementById(`makeAdminMember ${id}`).remove();
                document.getElementById(`removeMember ${id}`).remove();
              }
            };
            mainPPPP.insertBefore(optionsForMakeAdmin, this.nextSibling);
          }
        }
      }
    };
  }

  //add members for group
  function addMembersForGrp() {
    var mainAdminDiv = document.getElementById("adminDiv");
    const addMemebersForGrp = Object.assign(document.createElement("div"), {
      className: "addMemebersForGrp",
      id: "addMemebersForGrp",
      style: "color: white;",
    });
    mainAdminDiv.appendChild(addMemebersForGrp);

    var addMembersInput = document.createElement("input");
    addMembersInput.placeholder = "Name, Email or Phone number";
    addMembersInput.className = "addMembers";
    var addMembersButton = document.createElement("button");
    addMembersButton.textContent = "Search";
    addMembersButton.id = "addMembersInputButton";
    addMembersButton.className = "addMembersInputButton";
    addMembersButton.type = "submit";

    addMemebersForGrp.appendChild(addMembersInput);
    addMemebersForGrp.appendChild(addMembersButton);

    addMembersButton.addEventListener("click", async function () {
      var inputValue = addMembersInput.value.trim();
      if (inputValue.length === 0) {
        // Handle empty input
        return;
      }
      var searchBy = "unknown";
      if (inputValue.includes("@")) {
        // Input contains "@", so assume it's an email
        searchBy = "email";
      } else if (!isNaN(inputValue)) {
        // Input is a number, so assume it's a phone number
        searchBy = "phone";
      } else {
        // Input is not an email or phone number, so assume it's a name
        searchBy = "name";
      }

      // Clear old searchedUser divs
      var oldSearchedUsers = document.querySelectorAll(".searchedUser");
      oldSearchedUsers.forEach(function (oldSearchedUser) {
        oldSearchedUser.remove();
      });
      //clear error message for user not found
      const elementToRemove = document.querySelector(".searchedUserNotFound");
      if (elementToRemove) {
        elementToRemove.remove();
      }
      // TODO: Perform search using searchBy and inputValue
      const result = await axios.get(
        `http://localhost:4001/user/searching?searchType=${searchBy}&value=${inputValue}`
      );

      if (result.data.user.length != 0) {
        // // Remove existing searchedUser div if it exists
        // var existingSearchedUser = document.getElementById("searchedUser");
        // if (existingSearchedUser) {
        //   existingSearchedUser.remove();
        // }
        // Append new searchedUser divs
        result.data.user.forEach((user) => {
          var searchedUser = document.createElement("div");
          searchedUser.className = "searchedUser";
          searchedUser.id = `searchedUser${user.id}`;
          // searchedUser.textContent = user.username;
          searchedUser.innerHTML = `${user.username}`;
          var imgForAddUser = document.createElement("img");
          imgForAddUser.className = "imgForAddUser";
          imgForAddUser.src =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAaElEQVR4nO3XQQrAIAxEUY+Ye+Rk3sKbTRcWWrJps5Ba8h+4FIYRDbYGLCTJJI1z2ZdBXBcniGgkoJGIRmo2ovls+8vVb0F6Yt/zONCcG6uNXwWxLY4mo8atySBIRCMRjUQ0su0HCyUc7HrGF9/pTTAAAAAASUVORK5CYII=";
          searchedUser.appendChild(imgForAddUser);
          addMemebersForGrp.appendChild(searchedUser);
          // Add the hover effect
          searchedUser.addEventListener("mouseenter", () => {
            searchedUser.classList.add("hovered");
            searchedUser.innerHTML = `${user.username}<span class="block-gap">phone no: ${user.phoneNo}</span>`;
            imgForAddUser.classList.add("hovered");
            searchedUser.appendChild(imgForAddUser);
          });
          searchedUser.addEventListener("mouseleave", () => {
            searchedUser.innerHTML = `${user.username}`;
            searchedUser.classList.remove("hovered");
            imgForAddUser.classList.remove("hovered");
            searchedUser.appendChild(imgForAddUser);
          });
          imgForAddUser.addEventListener("click", async (event) => {
            // document.getElementById(`searchedUser${user.id}`).textContent =
            //   "hello";
            document.getElementById(`searchedUser${user.id}`).remove();
            await axios.put(
              `http://localhost:4001/user/addMemberForGrp?userId=${user.id}&groupId=${token2}`
            );
          });
        });
      } else if (result.data.user.length == 0) {
        const searchedUserNotFound = Object.assign(
          document.createElement("div"),
          {
            className: "searchedUserNotFound",
            innerHTML: "User not found!",
          }
        );
        addMemebersForGrp.appendChild(searchedUserNotFound);
      }
    });
  }

  // Define a function to handle clicks on the userMessages and navBar elements
  function handleElementClick(event) {
    // Get the adminDiv element
    const adminDiv = document.querySelector(".adminDiv");

    // Check if the adminDiv element exists
    if (adminDiv) {
      // Remove the adminDiv element from the DOM
      adminDiv.remove();
    }
  }

  // Add click event listeners to the userMessages and navBar elements
  document
    .getElementById("userMessages")
    .addEventListener("click", handleElementClick);
  document
    .getElementById("navBar")
    .addEventListener("click", handleElementClick);
};

let currentDivPers = null;
//showing users in the Main Div when making relations
function showPersonalChatUsersOnScreenMain(e) {
  var navBar = document.getElementById("navBar");
  var newwDiv = document.createElement("div");
  newwDiv.id = e.id;
  newwDiv.style.color = "white";
  newwDiv.className = "userNameDivMain";
  newwDiv.textContent = e.username;
  newwDiv.onclick = (event) => {
    personalChatInterface(event.target);
  };

  navBar.appendChild(newwDiv);

  socket.on("aaaaaa", function (forchat) {
    if (forchat == "personal") {
      setTimeout(() => {
        // personalChatInterface(currentDivPers);
        personalMsg(currentDivPers);
      }, 530);
    }
  });

  function personalChatInterface(data) {
    //input text area and user message height setting
    document.querySelector(".inputAndSubmit").style.display = "block";
    document.querySelector(".userMessages").style.height = "523px";

    currentDivPers = data;
    forChat = "personal";
    token2 = data.id;

    //removing admin option menu in personal chats
    var userNameInInterface = document.getElementById("userName");
    var buttonOption = document.getElementById("adminOption");
    if (buttonOption) {
      userNameInInterface.removeChild(buttonOption);
    }

    var div = document.getElementById("userMessages");
    div.innerHTML = "";
    document.getElementById("userNameToChat").textContent = e.username;

    personalMsg(data);
  }

  const personalMsg = async (data) => {
    try {
      await axios
        .get(`http://localhost:4001/messageChat?reciever_id=${data.id}`, {
          headers: { Authorization: token },
        })
        .then((result) => {
          console.log(result);
          const div = document.getElementById("userMessages");
          div.innerHTML = ""; // Clear existing messages
          result.data.data.forEach((e) => {
            showMessages(e, result.data.user);
          });
        });
    } catch (err) {
      console.log(err);
    }
  };
}

function showMessages(data, user) {
  if (data.type == "message") {
    if (data.message.sender_id == user) {
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      divvs.className = "ennd";
      var user = document.createElement("p");
      user.id = "spanMessageEnd";
      user.textContent = data.message.message;
      divvs.appendChild(user);
      div.appendChild(divvs);
    } else {
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      divvs.className = "starrt";
      var user = document.createElement("p");
      user.id = "spanMessageStart";
      user.textContent = data.message.message;
      divvs.appendChild(user);
      div.appendChild(divvs);
    }
  } else if (data.type == "image") {
    if (data.data.sender_id == user) {
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      divvs.className = "endFlexImagePersonal";
      let buffer = data.data.data.data;
      let binary = "";
      let bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let base64 = window.btoa(binary);
      // console.log(base64);
      let img = document.createElement("img");
      img.src = "data:image/jpeg;base64," + base64;
      img.id = "imagesInGrp";
      img.className = "imagesInGrp";
      divvs.appendChild(img);
      div.appendChild(divvs);
    } else {
      // console.log(data.data.sender.username);
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      // divvs.className = "startFlexImage";
      divvs.className = "startFlexImagePersonal";
      divvs.id = `${data.data.sender.username}`;
      let buffer = data.data.data.data;
      let binary = "";
      let bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let base64 = window.btoa(binary);
      // console.log(base64);
      let img = document.createElement("img");
      img.src = "data:image/jpeg;base64," + base64;
      img.id = "imagesInGrpStart";
      img.className = "imagesInGrpStart";
      divvs.appendChild(img);
      div.appendChild(divvs);
    }
  } else {
    if (data.data.sender_id == user) {
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      divvs.className = "endFlexDocumentPersonal";
      let buffer = data.data.data.data;
      let binary = "";
      let bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let base64 = window.btoa(binary);
      const filename = data.data.filename;
      const icon = getIconForFile(filename);
      const fileLink = document.createElement("a");
      fileLink.className = "documentsInGrp";
      fileLink.onclick = basimsw;
      fileLink.innerHTML = `<i class="${icon}"></i> ${filename}`;
      divvs.appendChild(fileLink);
      div.appendChild(divvs);
      function basimsw() {
        // create anchor element and click it programmatically
        // const link = document.createElement("a");
        fileLink.setAttribute(
          "href",
          `data:${data.data.filetype};base64,` + base64
          //   `data:application/octet-stream;base64,` + base64
        );
        fileLink.setAttribute(
          "href",
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
            base64
        );
        fileLink.setAttribute("download", `${filename}`);
        // link.setAttribute("download", "file.pdf");
      }
    } else {
      var div = document.getElementById("userMessages");
      var divvs = document.createElement("div");
      divvs.className = "startFlexDocumentPersonal";
      let buffer = data.data.data.data;
      let binary = "";
      let bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      //
      let base64 = window.btoa(binary);
      const filename = data.data.filename;
      const icon = getIconForFile(filename);
      const fileLink = document.createElement("a");
      fileLink.className = "documentsInGrpStart";
      fileLink.onclick = basimsw;
      fileLink.innerHTML = `<i class="${icon}"></i> ${filename}`;
      divvs.appendChild(fileLink);
      div.appendChild(divvs);
      function basimsw() {
        // create anchor element and click it programmatically
        // const link = document.createElement("a");
        fileLink.setAttribute(
          "href",
          `data:${data.data.filetype};base64,` + base64
          //   `data:application/octet-stream;base64,` + base64
        );
        fileLink.setAttribute(
          "href",
          "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," +
            base64
        );
        fileLink.setAttribute("download", `${filename}`);
        // link.setAttribute("download", "file.pdf");
      }
    }
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

//add document interface
const addDocument = document.getElementById("add-document");
const userChats = document.getElementById("userChats");
const addDocuments = document.getElementById("add-documents");

addDocument.addEventListener("mouseover", () => {
  addDocument.classList.add("hovered");
  userChats.style.cssText = "left: 255px; width: 522px;";
  addDocuments.style.display = "block";
});

addDocuments.addEventListener("mouseleave", () => {
  addDocument.classList.remove("hovered");
  userChats.style.cssText = "left: 63px; width: 714px;";
  addDocuments.style.display = "none";
});

//adding event for Documents
// document
//   .getElementById("documents_Button")
//   .addEventListener("click", function () {
//     var document_option = document.getElementById("document_option");
//     document_option.style.display = "block";

//     document
//       .getElementById("document_button_submit")
//       .addEventListener("click", async function () {
//         const fileInput = document.getElementById("document_file");
//         const file = fileInput.files[0];

//         if (!file) {
//           throw new Error("File is empty please upload the file");
//         }

//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("forChat", forChat);
//         formData.append("token2", token2);

//         const response = await axios.post(
//           "http://localhost:4001/user/addDocuments",
//           formData,
//           { headers: { Authorization: token } }
//         );

//         console.log(response);
//         //removing the document option div
//         document.getElementById("document_option").style.display = "none";
//       });
//   });
/////////////////////////

//adding event for Images
document
  .getElementById("documents_Button")
  .addEventListener("click", function () {
    var document_option = document.getElementById("document_option");
    document_option.style.display = "block";

    var submitBtn = document.getElementById("document_button_submit");

    // Remove previous event listener
    submitBtn.removeEventListener("click", onSubmitDocument);

    // Add new event listener
    submitBtn.addEventListener("click", onSubmitDocument);
  });

async function onSubmitDocument() {
  const fileInput = document.getElementById("document_file");
  const file = fileInput.files[0];

  if (!file) {
    document_option.style.display = "none";
    throw new Error("No Document was uploaded or the document is empty ");
  }

  const data = {
    forChat: forChat,
    token2: token2,
  };

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:4001/user/addDocuments",
    formData,
    {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
      params: data,
    }
  );

  // Clear the file input
  fileInput.value = "";

  // Hide the document option
  document_option.style.display = "none";
  socket.emit("new-data", forChat);
}

//adding event for Images
document.getElementById("images_Button").addEventListener("click", function () {
  var document_option = document.getElementById("document_option");
  document_option.style.display = "block";

  var submitBtn = document.getElementById("document_button_submit");

  // Remove previous event listener
  submitBtn.removeEventListener("click", onSubmitImage);

  // Add new event listener
  submitBtn.addEventListener("click", onSubmitImage);
});

async function onSubmitImage() {
  const fileInput = document.getElementById("document_file");
  const file = fileInput.files[0];

  if (!file) {
    document_option.style.display = "none";
    throw new Error("No images was uploaded or the images is empty ");
  }

  const data = {
    forChat: forChat,
    token2: token2,
  };

  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:4001/user/addImages",
    formData,
    {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
      params: data,
    }
  );

  // Clear the file input
  fileInput.value = "";

  // Hide the document option
  document_option.style.display = "none";
  socket.emit("new-data", forChat);
}

////////////for buffer////////////
if (!window.btoa) {
  window.btoa = function (string) {
    let buffer = new Uint8Array(string.length);

    for (let i = 0; i < string.length; i++) {
      buffer[i] = string.charCodeAt(i);
    }

    let binary = "";
    let bytes = new Uint8Array(buffer.buffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
  };
}

//for file icons

function getIconForFile(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return "fa fa-file-pdf-o";
    case "doc":
    case "docx":
      return "fa fa-file-word-o";
    case "xls":
    case "xlsx":
      return "fa fa-file-excel-o";
    case "ppt":
    case "pptx":
      return "fa fa-file-powerpoint-o";
    default:
      return "fa fa-file";
  }
}
