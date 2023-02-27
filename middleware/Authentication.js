const jwt = require("jsonwebtoken");

const getVerifyingIdFromToken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    // const token = localStorage.getItem("token");
    const valuesFromToken = jwt.verify(
      token,
      "5a4wd5ssqqvhopaisdswdwfw68acdaseSWddadASdWFG66545asd68WDdsa231A"
    );

    req.user = valuesFromToken.userId;
    req.names = valuesFromToken.names;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: "false" });
  }
};

module.exports = { getVerifyingIdFromToken };
