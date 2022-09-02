const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const moment = require("moment-timezone");
const cors = require("cors");
const db = require(__dirname + "/db_connect");
const sessionStore = new MysqlStore({}, db);
const upload = multer({ dest: __dirname + "/../tmp_uploads" });
const SocketServer = require("ws").Server;
const router = express.Router();

// 處理表單資料的body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const corsOptions = {
  credentials: true,
  orogin: function (origin, cb) {
    console.log(`origin: ${origin}`);
    cb(null, true);
  },
};

app.use(cors(corsOptions));

//連線資料庫
app.get("/try-db", (req, res) => {
  db.query("SELECT * FROM coupon_list LIMIT 2").then(([results]) => {
    res.json(results);
  });
});

app.use(express.static(__dirname + "/../public")); // 設定靜態檔案路徑

//範例
app.use("/example", require(__dirname + "/Name/example"));

// 測試
const parser = express.urlencoded({ extended: false });
app.post("/try-post", parser, (req, res) => {
  res.json(req.body);
});

//引入的檔案裡面一定要有東西，不然會報錯，所以先註解掉

//Cha
// app.use("/cart-api", require(__dirname + "/Cha/cha"));

// // Claudia
// app.use("/farm", require(__dirname + "/Claudia/test"));

// // Iris
// app.use("/member", require(__dirname + "/Iris/iris"));

// //Janice
// app.use("/index", require(__dirname + "/Janice/janice"));

// //Jess 商品
// app.use("/product", require(__dirname + "/Jess/jess"));

//Ru
app.use("/product", require(__dirname + "/Ru/ru"));

// Server
const server = app.listen(port, () => {
  console.log("伺服器已啟動");
});

const wss = new SocketServer({ server: server });

wss.on("connection", (ws) => {
  //連結時執行此 console 提示
  console.log("Client connected");

  let clients = wss.clients;

  //固定送最新時間給 Client
  const sendNowTime = setInterval(() => {
    // ws.send(String(new Date()));
  }, 1000);

  //對 message 設定監聽，接收從 Client 發送的訊息
  ws.on("message", async (clientData) => {
    const data = JSON.parse(clientData);

    switch (data.path) {
      case "/custom_list":
        console.log("data", data);
        try {
          let sql = "";
          sql =
            "INSERT INTO `foodgo`.`order_list` (`vice`, `main`, `side1`, `side2`, `side3`, `egg`, `count`) VALUES (?, ?, ?, ?, ?, ?, ?)";

          await db.execute(sql, [
            data.body.vice,
            data.body.main,
            data.body.side1,
            data.body.side2,
            data.body.side3,
            data.body.egg,
            data.body.count,
          ]);

          sql = "SELECT * FROM foodgo.order_list;";

          const orders = await db.execute(sql);
          console.log("orders", orders);

          clients.forEach((client) => {
            client.send(
              JSON.stringify({ message: orders[0], pathname: "/admin" })
            );
          });
        } catch (error) {
          console.log("error", error);
        }
        // try {
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
        break;
    }
    // console.log("Buffer.from(data)", Buffer.from(data, "utf8"));
    // console.log("clients", clients);

    // clients.forEach((client) => {
    //   client.send(
    //     JSON.stringify({ message: data.toString(), pathname: "/admin" })
    //   );
    // });
    ws.send(data.toString());
  });

  //當 WebSocket 的連線關閉時執行
  ws.on("close", () => {
    clearInterval(sendNowTime);
    // console.log("Close connected");
    // console.log("clients", clients);
  });
});
