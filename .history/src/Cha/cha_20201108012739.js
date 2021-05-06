//引入express
const express = require('express');
//引入router，路由模組化
const router = express.Router();
//引入需要用的套件
// const { v4: uuidv4 } = require('uuid');
// 引入資料庫
const db = require(__dirname + '/../db_connect');
//路由名稱+功能

// GET會員資料表
router.get('/member', (req, res) => {
    db.query('SELECT * FROM `member_list` WHERE 1')
        .then(([results]) => {
            res.json(results);
        })
});

// GET我的訂單資料表
router.get('/my-order', (req, res) => {
    db.query('SELECT * FROM `my_order` WHERE 1')
        .then(([results]) => {
            res.json(results);
        })
});

// GET訂單明細資料表
router.get('/my-order-detail', (req, res) => {
    db.query('SELECT * FROM `my_order_detail` WHERE 1')
        .then(([results]) => {
            res.json(results);
        })
});
// GET商品資料表
router.get('/product', (req, res) => {
    db.query('SELECT * FROM `product` WHERE 1')
        .then(([results]) => {
            res.json(results);
        })
});


// 新增到「我的訂單」資料表

// router.post('/my-order', async (req, res)=>{
//     const sql = "INSERT INTO `my_order` set ?";
//      await db.query(sql, [ req.body ]);
//      res.json(req.body);
//      });
router.post('/my-order-detail', async (req, res)=>{
    const sql = "INSERT INTO `my_order_detail` set ?";
     await db.query(sql, [ req.body ]);
     res.json(req.body);
});
router.post('/my-order', async (req, res)=>{
    const sql = "INSERT INTO `my_order` set ?";
    const [{affectedRows, insertId}] = await db.query(sql, [ req.body ]);
    res.json({
                success: !!affectedRows,
                affectedRows,
                insertId,
            });
// router.post('/my-order', async (req, res)=>{
//     const sql = "INSERT INTO `myorder` set ?";
//     const [{affectedRows, insertId}] = await db.query(sql, [ req.body ]);
//     res.json({
//         success: !!affectedRows,
//         affectedRows,
//         insertId,
//     });
// });
// router.post('/myorder', async (req, res)=>{
//     const sql = "INSERT INTO `address_book` set ?";
//      await db.query(sql, [ req.body ]);
// });
// 手機格式
// app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=> {
//     let u = req.url.slice(3).split('?')[0];
//     u = u.replace(/-/g, '');
//     res.send(u);
// }); 

//輸出路由
module.exports = router;