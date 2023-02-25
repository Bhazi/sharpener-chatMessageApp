const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.postSignUp = (req, res, next) => {
  var { name, email, phone, password } = req.body;

  try {
    if (name == "" || email == "" || phone == "" || password == "") {
      return res.status(400).json();
    }

    bcrypt.hash(password, 10, async (req, hash) => {
      await User.create({
        name: name,
        email: email,
        phoneNo: phone,
        password: hash,
      })
        .then((data) => {
          res.status(201).json();
        })
        .catch((err) => {
          console.log("already exist the mail");
          res.status(401).json();
        });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json();
  }
};
