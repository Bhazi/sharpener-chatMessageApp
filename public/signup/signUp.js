async function signup(e) {
  e.preventDefault();
  const nameForm = document.getElementById("name").value;
  const emailForm = document.getElementById("email").value;
  const phoneForm = document.getElementById("phoneNo").value;
  const passwordForm = document.getElementById("password").value;

  await axios
    .post(`http://localhost:4001/user/signup`, {
      name: nameForm,
      email: emailForm,
      phone: phoneForm,
      password: passwordForm,
    })
    .then((result) => {
      if (result.status == 201) alert("Successfully signed up !");
      // window.location.href = "../login/login.html";
    })
    .catch((err) => {
      console.log(err.response.status);
      if (err.response.status == 401) {
        var pop = document.getElementById("alreadyExist");
        let p = document.createElement("p");
        p.className = "message";
        p.textContent = "* User already exists";
        pop.appendChild(p);
      }
    });
}
