//引入express
const express = require('express');

//引入router
const router = express.Router();

//引入需要用的套件
const { v4: uuidv4 } = require('uuid');

const db = require(__dirname + '/../db_connect');

//路由名稱+功能
router.get('/member_list', (req, res) => {
    db.query('SELECT * FROM member_list')
        .then(([results]) => {
            res.json(results);
        })
    });

// ---------- 更新會員資料 ---------- //
router.post("/updateAdress", (req, res) => {
  const nnewAddressData = req.body;
  const county = req.body.county;
  const district = req.body.district;
  const address = req.body.address;

  const sql =
    "UPDATE `member_list` SET `county`='" +
    county +
    "',`district`='" +
    district +
    "',`address`='" +
    address +
    "' WHERE `member_sid`='" +
    nnewAddressData.member_id +
    "'";
  db.query(sql);
  res.json(nnewAddressData);
});


//輸出路由
module.exports = router;