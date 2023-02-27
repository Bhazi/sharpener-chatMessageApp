const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

// exports.getchatInterface = (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "../", "public", "chatPage", "chatPage.html")
//   );
// };

exports.getUserName = (req, res) => {
  console.log(req.user, req.names);
  res
    .status(200)
    .json({ name: req.names, message: "hello welcome to this world" });

  //     const idd = req.user;
  //   var attributes = ["ispremiumuser"];
  //   const isPremium = await Login.findOne({
  //     where: { id: req.user },
  //     attributes: attributes,
  //   });

  //   const page = parseInt(req.query.page);
  //   const ITEMS_PER_PAGE = parseInt(req.query.limit);

  //   var totalCount = await Expense.count({ where: { loginId: idd } });

  //   const user = await Expense.findAll({
  //     where: { loginId: idd },
  //     offset: (page - 1) * ITEMS_PER_PAGE,
  //     limit: ITEMS_PER_PAGE,
  //   });

  //   if (user == "") {
  //     return res.status(200).json({ premium: isPremium, datas: null });
  //   } else {
  //     res.status(200).json({
  //       allUsers: user,
  //       currentPage: page,
  //       hasNextPage: ITEMS_PER_PAGE * page < totalCount,
  //       nextPage: page + 1,
  //       hasPreviousPage: page > 1,
  //       previousPage: page - 1,
  //       lastPage: Math.ceil(totalCount / ITEMS_PER_PAGE),
  //       premium: isPremium,
  //     });
  //   }
};
