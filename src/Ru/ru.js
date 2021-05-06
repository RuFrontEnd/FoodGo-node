const express = require("express");
const router = express.Router();
const db = require(__dirname + "/../db_connect");

router.get("/custom_list", (req, res) => {
  // 下SQL語法求取資料
  db.query("SELECT * FROM custom_list").then(([results]) => {
    res.json(results);
  });
});

module.exports = router;
