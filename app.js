const express = require("express");

const path = require("path");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const userRoutes = require("./routes/user");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user",userRoutes);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});


// app.listen(4001);

sequelize
  .sync()
  .then(() => {
    app.listen(4001);
  })
  .catch();
