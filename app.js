const express = require("express");

const path = require("path");
const app = express();

const cors = require("cors");
app.use(cors({ origin: "*" }));

const bodyParser = require("body-parser");

const user = require("./models/user");
const chats = require("./models/chats");

const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chats");
const { use } = require("./routes/chats");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use(chatRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

// app.listen(4001);

user.hasMany(chats);
chats.belongsTo(user);

sequelize
  .sync()
  .then(() => {
    app.listen(4001);
  })
  .catch();
