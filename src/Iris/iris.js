//引入express
const express = require("express");
const db = require(__dirname + "/../db_connect");
const session = require("express-session");

//引入router
const router = express.Router();

//引入需要用的套件
const { v4: uuidv4 } = require("uuid");

// -------- 取得所有投稿資料--------------//
router.get("/commetList", (req, res) => {
  db.query(
    "SELECT * FROM `product` INNER JOIN `message` ON `message`.`product_sid`=`product`.`sid`"
  ).then(([results, fields]) => {
    res.json(results);
  });
});

// -------- 更新投稿資料------------//
router.post("/updateComment", (req, res) => {
  const updatedComment = req.body;
  const sql =
    "UPDATE `message` SET `created_at`= NOW(),`content`='" +
    updatedComment.newComment +
    "' WHERE `sid`='" +
    updatedComment.commentSid +
    "'";
  db.query(sql);
  res.json(updatedComment);
});

// -------- 刪除投稿 -------- //
router.post("/deleteComment", (req, res) => {
  const commentToBeDelete = req.body;
  const sql =
    "DELETE FROM `message` WHERE `sid`='" + commentToBeDelete.commentSid + "' ";
  db.query(sql);
  res.json(commentToBeDelete);
});

// -------- 取得我的最愛--------------//
router.get("/myFavList", (req, res) => {
  db.query(
    "SELECT * FROM `my_fav` INNER JOIN `product` ON `my_fav`.`product_sid`=`product`.`sid`"
  ).then(([results, fields]) => {
    res.json(results);
  });
});

// -------- 取得優惠券資訊--------------//
router.get("/couponList", (req, res) => {
  db.query("SELECT * FROM `coupon_list`").then(([results, fields]) => {
    res.json(results);
  });
});

// -------- 取得優惠券領取狀態--------------//
router.get("/couponStatus", (req, res) => {
  db.query("SELECT * FROM `coupon_status`").then(([results, fields]) => {
    res.json(results);
  });
});

// ---------- 新增優惠券領取狀態 ---------- //
router.post("/addCouponStatus", (req, res) => {
  const newUserSid = req.body;

  const sql =
    "INSERT INTO `coupon_status` set `member_sid`='" +
    newUserSid.currentUser +
    "'";

  db.query(sql);
  res.json(newUserSid);
});

// ---------- 新增優惠券  ---------- //
router.post("/addCoupon", (req, res) => {
  const newUserData = req.body;

  const sql =
    "INSERT INTO `coupon_list` set `member_sid`='" +
    newUserData.currentUser +
    "',`coupon_type`='" +
    newUserData.coupon_type +
    "',`coupon_due`=DATE_ADD(NOW(),INTERVAL 1 MONTH)";

  db.query(sql);
  res.json(newUserData);
});

// ---------- 更改優惠券狀態 ---------- //
router.post("/changeCouponStatus", (req, res) => {
  const statusChanged = req.body;

  const sql =
    "UPDATE `coupon_status` SET `coupon1_status`='" +
    statusChanged.coupon1 +
    "',`coupon2_status`='" +
    statusChanged.coupon2 +
    "' WHERE `member_sid`='" +
    statusChanged.currentUser +
    "'";

  db.query(sql);
  res.json(statusChanged);
});

// ------- 取得會員資料(登入,修改頁面) ------- //
router.get("/allUserProfile", (req, res) => {
  db.query("SELECT * FROM member_list").then(([results, fields]) => {
    res.json(results);
  });
});

// ---------- 新增最愛 ---------- //
router.post("/addMyFav", (req, res) => {
  const newFavItem = req.body;

  const sql =
    "INSERT INTO `my_fav` set `product_sid`='" +
    newFavItem.product_sid +
    "',`member_sid`='" +
    newFavItem.currentUser +
    "'";

  db.query(sql);
  res.json(newFavItem);
});

// ---------- 刪除最愛 ---------- //
router.post("/deleteMyFav", (req, res) => {
  const itemToBeDelete = req.body;
  const sql =
    "DELETE FROM `my_fav` WHERE `member_sid`='" +
    itemToBeDelete.currentUser +
    "' AND `product_sid`='" +
    itemToBeDelete.product_sid +
    "'";
  db.query(sql);
  res.json(itemToBeDelete);
});

// ---------- 會員註冊 ---------- //
router.post("/userRegister", (req, res) => {
  const newRegister = req.body;
  const sql =
    "INSERT INTO `member_list`( `account`, `password`,`mobile`, `email`) VALUES ('" +
    newRegister.account +
    "','" +
    newRegister.password +
    "','" +
    newRegister.mobile +
    "','" +
    newRegister.email +
    "')";
  db.query(sql);
  res.json(newRegister);
});

// ---------- 更新會員資料 ---------- //
router.post("/updateProfile", (req, res) => {
  const newProfile = req.body;
  const fulladdress = "" + req.body.address;
  const county = fulladdress.slice(0, 3);
  const district = fulladdress.slice(3, 6);
  const address = fulladdress.slice(6);

  const sql =
    "UPDATE `member_list` SET `password`='" +
    newProfile.password +
    "',`name`='" +
    newProfile.familyname +
    newProfile.givenname +
    "',`birthday`='" +
    newProfile.birthday +
    "',`mobile`='" +
    newProfile.mobile +
    "',`email`='" +
    newProfile.email +
    "',`county`='" +
    county +
    "',`district`='" +
    district +
    "',`address`='" +
    address +
    "' WHERE `member_sid`='" +
    newProfile.member_id +
    "'";
  db.query(sql);

  res.json(newProfile);
});

//輸出路由
module.exports = router;

//網址列輸入 localhost:5000/example/try-uuid 看結果
