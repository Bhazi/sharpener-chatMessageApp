const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.postLogIn = async (req, res, next) => {
  var { email, password } = req.body;

  //checking email exist or not in database

  const emailsIsThereOrNot = await User.findOne({ where: { email: email } });
  if (emailsIsThereOrNot == null) {
    return res.status(404).json();
  }

  //finding password belongs to the email

  var attributes = ["password", "id", "name"];
  const passwordFromDb = await User.findOne({
    where: { email: email },
    attributes: attributes,
  });

  var obj = JSON.stringify(passwordFromDb);
  obj = JSON.parse(obj);

  //tokenising the ID
  function tokenising(id, name) {
    return jwt.sign({ userId: id, names: name }, process.env.TOKEN_SECRET);
  }

  bcrypt.compare(password, obj.password, (err, result) => {
    if (result) {
      res.status(200).json({
        message: "User login sucessful",
        token: tokenising(obj.id, obj.name),
      });
    } else {
      res.status(401).json();
    }
  });
};
