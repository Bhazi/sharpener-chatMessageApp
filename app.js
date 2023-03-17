// const express = require("express");

// const path = require("path");
// const app = express();

// const cors = require("cors");
// app.use(cors({ origin: "*" }));

// const bodyParser = require("body-parser");
// const sequelize = require("./util/database");

// // const UserRelationship = require("./models/userRelationship");

// const userRoutes = require("./routes/user");
// const chatRoutes = require("./routes/message");

// const User = require("./models/user");
// const Message = require("./models/messages");
// const UserRelationship = require("./models/userRelationship");
// const GroupName = require("./models/groupName");
// const GroupMembers = require("./models/groupMembers");
// const GroupMessage = require("./models/groupMessage");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/user", userRoutes);
// app.use(chatRoutes);

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, `public/${req.url}`));
// });

// // Define the relationships between the models
// User.hasMany(Message, { foreignKey: "sender_id" });
// User.hasMany(Message, { foreignKey: "receiver_id" });
// Message.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
// Message.belongsTo(User, { as: "receiver", foreignKey: "receiver_id" });

// User.belongsToMany(User, {
//   as: "projects",
//   foreignKey: "user_id",
//   through: "UserRelationship",
// });
// User.belongsToMany(User, {
//   as: "basim",
//   foreignKey: "follower_id",
//   through: "UserRelationship",
// });
// UserRelationship.belongsTo(User, { as: "user", foreignKey: "follower_id" });

// //group associating
// User.belongsToMany(GroupName, {
//   through: GroupMembers,
//   as: "groups",
//   foreignKey: "user_id",
// });
// GroupName.belongsToMany(User, {
//   through: GroupMembers,
//   as: "users",
//   foreignKey: "group_id",
// });

// GroupMembers.belongsTo(User, { as: "users", foreignKey: "user_id" });

// GroupName.hasMany(GroupMessage);
// GroupMessage.belongsTo(GroupName);

// User.hasMany(GroupMessage);
// GroupMessage.belongsTo(User);

// sequelize
//   .sync({ force: false })
//   .then(() => {
//     app.listen(4001);
//   })
//   .catch();
/////////////////////////////////////////////

const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/message");
const User = require("./models/user");
const Message = require("./models/messages");
const UserRelationship = require("./models/userRelationship");
const GroupName = require("./models/groupName");
const GroupMembers = require("./models/groupMembers");
const GroupMessage = require("./models/groupMessage");

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use(chatRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

// Define the relationships between the models
User.hasMany(Message, { foreignKey: "sender_id" });
User.hasMany(Message, { foreignKey: "receiver_id" });
Message.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiver_id" });
User.belongsToMany(User, {
  as: "projects",
  foreignKey: "user_id",
  through: "UserRelationship",
});
User.belongsToMany(User, {
  as: "basim",
  foreignKey: "follower_id",
  through: "UserRelationship",
});
UserRelationship.belongsTo(User, { as: "user", foreignKey: "follower_id" });

//group associating
User.belongsToMany(GroupName, {
  through: GroupMembers,
  as: "groups",
  foreignKey: "user_id",
});
GroupName.belongsToMany(User, {
  through: GroupMembers,
  as: "users",
  foreignKey: "group_id",
});

GroupMembers.belongsTo(User, { as: "users", foreignKey: "user_id" });

GroupName.hasMany(GroupMessage);
GroupMessage.belongsTo(GroupName);

User.hasMany(GroupMessage);
GroupMessage.belongsTo(User);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // socket.on("new-data", (sss) => {
  //   console.log(
  //     "bassssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss1"
  //   );
  //   io.emit("aaaaaa", sss);
  // });

  socket.on("new-data", function (data) {
    io.emit("aaaaaa", data);
  });
});

sequelize
  .sync({ force: false })
  .then(() => {
    server.listen(4001, () => {
      console.log("Server listening on port 4001");
    });
  })
  .catch((err) => console.log(err));

/////////////////////////////

// const express = require("express");
// const path = require("path");
// const app = express();
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const http = require("http");
// const server = http.createServer(app);
// const io = require("socket.io")(server);
// const sequelize = require("./util/database");

// app.use(cors({ origin: "*" }));
// const userRoutes = require("./routes/user");

// const Sample = require("./models/sample");

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/user", userRoutes);
// ////////////////////////////////////////////////////////////
// app.get("/indd", (req, res) => {
//   res.sendFile(path.join(__dirname, "src", "indd.html"));
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   console.log(socket.id);

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("new-data", (sss) => {
//     console.log(sss);
//     io.emit("aaaaaa", sss);
//   });
// });

// // // Set up a Sequelize event listener for new rows added to the 'users' table
// Sample.afterCreate((user, options) => {
//   io.emit("newUser", user);
// });

// //////////////////////////////////////////////////////////////////////

// sequelize
//   .sync({ force: false })
//   .then(() => {
//     server.listen(3000, () => {
//       console.log("Server listening on port 3000");
//     });
//   })
//   .catch((err) => console.log(err));

// const express = require("express");
// const path = require("path");
// const app = express();

// app.get("/indd", (req, res) => {
//   res.sendFile(path.join(__dirname, "src", "indd.html"));
// });

// app.listen(3000, () => {
//   console.log(`Example app listening on port ${3000}`);
// });
