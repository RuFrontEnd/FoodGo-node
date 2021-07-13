//引入express
const express = require("express");
const db = require(__dirname + "/../db_connect");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
  console.log("req.query", req.query);
  const member_sid = req.query.member_sid;
  // INNER JOIN 比對 表1表2
  db.query(
    `SELECT * FROM \`my_fav\` INNER JOIN \`product\` ON \`my_fav\`.\`product_sid\`=\`product\`.\`sid\` WHERE \`member_sid\`='${member_sid}' `
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
  // const newUserSid = req.body;
  // const sql =
  //   "INSERT INTO `coupon_status` set `member_sid`='" +
  //   newUserSid.currentUser +
  //   "'";
  // db.query(sql);
  // res.json(newUserSid);
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

// ------- 取得全部會員資料(登入,修改頁面) ------- //
router.get("/allUserProfile", (req, res) => {
  db.query("SELECT * FROM member_list").then(([results, fields]) => {
    res.json(results);
  });
});

// ------- 取得單一會員資料(登入,修改頁面) ------- //
router.get("/singleUserProfile", (req, res) => {
  const member_sid = req.query.member_sid;
  console.log(member_sid);
  db.query(`SELECT * FROM member_list WHERE member_sid=${member_sid}`).then(
    ([results, fields]) => {
      res.json(results);
    }
  );
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
router.post("/userRegister", async (req, res) => {
  const newRegister = req.body;
  console.log("newRegister", newRegister);
  let unPassTimes = 0;

  await db.query("SELECT * FROM member_list").then((res) => {
    let comparisons = [];
    res[0].forEach((row) => {
      const _comparisons = {
        account: row.account,
      };
      comparisons.push(_comparisons);
    });

    comparisons.forEach((comparison) => {
      unPassTimes += comparison.account === newRegister.account ? 1 : 0;
    }); // 比對是否註冊過

    try {
      const confirmationCode = jwt.sign(
        { email: req.body.email },
        process.env.MAIL_SECRET
      );

      if (unPassTimes === 0) {
        const sql =
          "INSERT INTO `member_list`( `account`, `password`, `name`, `mobile`, `email`, `isVerified`, `confirmation_code`) VALUES ('" +
          newRegister.account +
          "','" +
          newRegister.password +
          "','" +
          newRegister.name +
          "','" +
          newRegister.mobile +
          "','" +
          newRegister.email +
          "','" +
          0 +
          "','" +
          confirmationCode +
          "')";
        db.query(sql);

        // 寄驗證信
        // Gmail 低安全權限 https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4OM-QK8H1OSKff6qljwuPfefw4yHESqLneeBQel7Ykbv5U3m7hEvUbQ2jwQNmmfkF9tt3LjKHVYEgd9hnbYRa7bSss56Q
        const transport = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false, // true for 465, false for other ports
          service: "Gmail",
          auth: {
            user: process.env.EMAILACCOUNT,
            pass: process.env.EMIALPASSWORD,
          },
        });

        transport
          .sendMail({
            from: process.env.EMAILACCOUNT,
            to: newRegister.email,
            subject: "Please confirm your account",
            html: `<h1>Email Confirmation</h1>
              <h2>Hello ${newRegister.account}</h2>
              <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href=http://localhost:5000/member/verifyEmail?confirmationCode=${confirmationCode}> Click here</a>
              </div>`,
          })
          .catch((err) => console.log("sendMail ERR", err));
      }
    } catch (error) {
      console.log("register error", error);
    }
  });

  if (unPassTimes === 0) {
    res.status(201).json({
      status: true,
      message: "註冊成功",
      ...newRegister,
    });
  } else {
    res.status(400).json({
      status: false,
      message: "註冊失敗，帳號已被使用",
    });
  }
});

// ---------- 驗證信箱 ---------- //
router.get("/verifyEmail", async (req, res) => {
  const confirmationCode = await req.query.confirmationCode;
  await jwt.verify(
    confirmationCode,
    process.env.MAIL_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: "mail token驗證失敗",
        });
      } else {
        const sql = `UPDATE \`member_list\` SET \`confirmation_code\` = '', \`isVerified\`= 1 WHERE \`confirmation_code\`='${confirmationCode}'`;
        db.query(sql); // 將信箱驗證狀態改為true(1), 並取消confirmation_code

        return res.redirect("http://localhost:3300"); // ***之後改成驗證成功畫面***
      }
    }
  );
});

// ---------- 會員登入 ---------- //
// const verifyToken = (req, res, next) => {
//   let token;
//   console.log("req", req);
//   try {
//     token = req.headers["authorization"].split(" ")[1];
//   } catch (err) {
//     console.log("抓取token錯誤, token設為空字串", err);
//     token = "";
//   }
//   if (token) {
//     console.log("token", token);
//     jwt.verify(token, process.env.SECRET, (err, decoded) => {
//       if (err) {
//         res.status(401).json({
//           status: false,
//           message: "token驗證失敗",
//         });
//       } else {
//         return res.status(200).json({ status: true, message: "登入成功" });
//       }
//     });
//   }
//   if (!token) {
//     next();
//   }
// }; // 判斷是否有Token

router.post("/login", async (req, res) => {
  try {
    const { account, password } = req.body;
    // console.log("req.body", req.body);
    const user = await db.query(
      `SELECT * FROM member_list WHERE account='${account}'`
    );

    if (user[0][0].isVerified === 0) {
      return res.status(401).json({
        status: false,
        message: "帳號尚未驗證",
      });
    }
    if (!user[0].length) {
      return res.status(404).json({ status: false, message: "帳號密碼錯誤" });
    }
    if (user[0][0].password !== password) {
      return res.status(403).json({ status: false, message: "密碼錯誤" });
    }
    const token = jwt.sign({ account, password }, process.env.SECRET);
    res.status(200).json({
      status: true,
      message: "登入成功",
      currentUser: user[0][0].member_sid,
      currentUserData: user[0][0],
      accessToken: token,
    });
  } catch (err) {
    console.log("登入程序錯誤", err);
    res.status(500).json({ status: false, message: "登入失敗" });
  }
});

router.post("/loginVerify", async (req, res) => {
  try {
    const { currentUser } = req.body;
    let token;
    const user = await db.query(
      `SELECT * FROM member_list WHERE member_sid='${currentUser}'`
    );

    try {
      token = req.headers["authorization"].split(" ")[1];
    } catch (err) {
      console.log("抓取token錯誤, token設為false", err);
      token = false;
    } finally {
      if (token) {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
          if (err) {
            return res.status(401).json({
              status: false,
              message: "token驗證失敗",
            });
          } else {
            return res.status(200).json({
              status: true,
              message: "登入成功",
              currentUser: user[0][0].member_sid,
              currentUserData: user[0][0],
            });
          }
        });
      }
      if (!token) {
        return res.status(401).json({
          status: false,
          message: "無token驗證",
        });
      }
    }
  } catch (err) {
    console.log("登入程序錯誤", err);
    res.status(500).json({ status: false, message: "登入失敗" });
  }
});

// ---------- 更新會員資料 ---------- //
router.post("/updateProfile", (req, res) => {
  const newProfile = req.body;
  console.log("newProfile", newProfile);
  // console.log("newProfile", newProfile);
  const fulladdress = "" + req.body.address;
  const county = fulladdress.slice(0, 3); // 縣市
  const district = fulladdress.slice(3, 6); // 區
  const address = fulladdress.slice(6); // 細部地址

  const sql =
    "UPDATE `member_list` SET `password`='" +
    newProfile.password +
    "',`name`='" +
    newProfile.name +
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
