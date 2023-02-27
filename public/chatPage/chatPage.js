var token = localStorage.getItem("token");

pop();
async function pop() {
  await axios
    .get("http://localhost:4001/message", {
      headers: { Authorization: token },
    })
    .then((result) => {
      var tr = document.getElementById("chatTemp");
      var yt = document.getElementById("user1");
      yt.textContent = `${result.data.name} : `;
      var p = document.createElement("span");
        p.textContent = result.data.message;
      console.log(result.data.message);
      yt.appendChild(p);
      tr.nextSibling(yt);
    })
    .catch((err) => console.log(err));
}

// document.getElementById("hello").textContent = ;

// const token = req.header("Authorization");
// const userId = jwt.verify(
//   token,
//   "45asd@asd8a6sd45POsoO0ddw2s9kA56s#o3asd3da22WwoW52"
// ).userId;

// const expense = req.body.expense;
// const desc = req.body.description;
// const category = req.body.category;

// var attributes = ["totalExpenses"];
// const pass = await Login.findOne({
//   where: { id: userId },
//   attributes: attributes,
// });

// var totalExpensesChanged = pass.dataValues.totalExpenses + parseInt(expense);

// await Login.update(
//   { totalExpenses: totalExpensesChanged },
//   { where: { id: userId } }
// );

// await Expense.create({
//   expense: expense,
//   description: desc,
//   category: category,
//   loginId: userId,
// });
// return res.status(201).json();
