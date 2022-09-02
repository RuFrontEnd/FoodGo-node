const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../db_connect");
const ws = require(__dirname + "/../server");

router.get("/custom_list", (req, res) => {
  // 下SQL語法求取資料
  db.query("SELECT * FROM custom_list").then(([results]) => {
    res.json(results);
  });
});

router.get("/order_list", (req, res) => {
  db.query("SELECT * FROM order_list").then(([results]) => {
    res.json(results);
  });
});

// router.post("/custom_list", async (req, res) => {
//   // 下SQL語法求取資料
//   console.log("req.body", req.body);
//   console.log("ws", ws);
//   try {
//     let sql =
//       "INSERT INTO `foodgo`.`order_list` (`vice`, `main`, `side1`, `side2`, `side3`, `egg`) VALUES (?, ?, ?, ?, ?, ?)";
//     await db.execute(sql, [
//       req.body.vice,
//       req.body.main,
//       req.body.side1,
//       req.body.side2,
//       req.body.side3,
//       req.body.egg,
//     ]);

//     return res.status(200).json({
//       ok: true,
//     });
//   } catch (err) {
//     console.log("err", err);
//     return res.status(400).json({
//       ok: false,
//       error: "MySQL error.",
//     });
//   }
// });

module.exports = router;
