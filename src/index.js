const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const moment = require("moment-timezone");
const cors = require("cors");
const db = require(__dirname + "/db_connect");
const sessionStore = new MysqlStore({}, db);
const upload = multer({ dest: __dirname + "/../tmp_uploads" });

// 處理表單資料的body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const corsOptions = {
    credentials: true,
    orogin: function (origin, cb){
        console.log(`origin: ${origin}`);
        cb(null,true);
    }
};

app.use(cors(corsOptions))


//連線資料庫
app.get('/try-db', (req, res) => {
    db.query('SELECT * FROM coupon_list LIMIT 2')
        .then(([results]) => {
            res.json(results);
        })
});


app.use(express.static(__dirname + "/../public"));

//範例
app.use('/example', require(__dirname + '/Name/example'));

// 測試
const parser = express.urlencoded({ extended: false });
app.post("/try-post", parser, (req, res) => {
  res.json(req.body);
});



//引入的檔案裡面一定要有東西，不然會報錯，所以先註解掉

//Cha
app.use('/cart-api', require(__dirname + '/Cha/cha'));

// Claudia
app.use('/farm', require(__dirname + '/Claudia/test'));

// Iris
app.use('/member', require(__dirname + '/Iris/iris'));

//Janice
app.use('/index', require(__dirname + '/Janice/janice'));

//Jess 商品
app.use('/product', require(__dirname + '/Jess/jess'));

//Ru
app.use("/product", require(__dirname + "/Ru/ru"));

// Server
app.listen(5000, () => {
  console.log("伺服器已啟動");
});
