async function signup(e) {
  e.preventDefault();
  const emailForm = document.getElementById("email").value;
  const passwordForm = document.getElementById("password").value;

  await axios
    .post(`http://localhost:4001/user/login`, {
      email: emailForm,
      password: passwordForm,
    })
    .then((result) => {
      if (result.status == 200) {
        alert("Successfully logged ! ");
        console.log(result);
        // window.location.href = "../login/login.html";
      }
    })
    .catch((err) => {
      if (err.response.status == 401) {
        document.getElementById("signupLink").style.top = "291px";

        var pop = document.getElementById("userDeclined");
        let p = document.createElement("p");
        p.className = "message";
        p.textContent = "User not Authorized !";
        pop.appendChild(p);
      } else {
        document.getElementById("signupLink").style.top = "291px";

        var pop = document.getElementById("userDeclined");
        let p = document.createElement("p");
        p.className = "message";
        p.textContent = "User not found !";
        pop.appendChild(p);
      }
    });
}
