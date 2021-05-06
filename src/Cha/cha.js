//引入express
const express = require('express');
//引入router，路由模組化
const router = express.Router();
//引入需要用的套件
// const { v4: uuidv4 } = require('uuid');
// 引入資料庫
const db = require(__dirname + '/../db_connect');
//路由名稱+功能

//// 購物車的API
// GET會員資料表
router.get('/member/:id', (req, res) => {
    db.query(`SELECT * FROM \`member_list\` WHERE member_sid =${req.params.id}`)
        .then(([results]) => {
            res.json(results);
        })
});
    
// 從「購物車」新增訂單資料到「我的訂單」資料表
    router.post('/my-order', async (req, res)=>{
        const sql = "INSERT INTO `my_order` set ?";
        const [{affectedRows, insertId}] = await db.query(sql, [ req.body ]);
        res.json({
            success: !!affectedRows,
            affectedRows,
            insertId,
        });
    });

// 從「購物車」新增訂單資料到「我的訂單明細」資料表
router.post('/my-order-detail', async (req, res)=>{
    // console.log(req.body)

     const sql = "INSERT INTO `my_order_detail` (member_sid,order_sid,product_sid,product_amount, product_name,product_price,product_image) VALUES ?";

     const rebuild =req.body.map((item)=>[item.member_sid,item.order_sid,item.product_sid,item.product_amount,item.product_name,item.product_price,item.product_image ])
    // console.log(rebuild)
    const [{affectedRows, insertId}] = await db.query(sql, [rebuild]);
    res.json({
        success: !!affectedRows,
        affectedRows,
        insertId,
    });
});
//從「購物車」刪除「優惠券資料表」的資料
router.delete('/use-coupon/:sid',  async (req, res)=> {

    const sql = "DELETE FROM `coupon_list` WHERE sid=?";
    const [results] = await db.query(sql, [req.params.sid]);

    res.json(results);
});

//----------------訂單管理的API-------------------//
// 從「訂單管理」讀取「我的訂單資料表」
router.get('/my-order/:id', (req, res) => {
    db.query(`SELECT * FROM \`my_order\` WHERE member_sid =${req.params.id}`)
        .then(([results]) => {
            res.json(results);
        })
    });
    
// router.post('/my-order', async (req, res)=>{
//     const sql = "INSERT INTO `my_order` set ?";
//      await db.query(sql, [ req.body ]);
//      res.json(req.body);
//      });

//從「訂單管理」讀取「訂單明細資料表」
router.get('/my-order-detail/:id', (req, res) => {
    db.query(`SELECT * FROM \`my_order_detail\` WHERE order_sid = ${req.params.id}`)
    // res.json({
    //     id:req.params.id
    // })
    .then(([results]) => {
        res.json(results);
    })
});

// 從「訂單管理」讀取「我的訂單」+「我的訂單明細」資料表
router.get('/my-order-my-order-detail/:id',async (req, res) => {
   const [a]= await db.query(`SELECT * FROM \`my_order\` WHERE member_sid =${req.params.id}`)
//    res.json(results);
   const [b]= await db.query(`SELECT * FROM \`my_order_detail\` WHERE member_sid = ${req.params.id}`)
   const result = a.map((item)=>{
       const x = b.filter((e)=>e.order_sid===item.sid)
       return(
           {...item,
        order_detail: x 
        }
       )
   })
   res.json(result);            
});
//修改訂單狀態
router.post('/my-order-chang-state', async (req, res)=>{
    const {sid, order_state} = req.body;
    const sql =`UPDATE \`my_order\` SET order_state=?  WHERE sid=?`

    const [result] = await db.query(sql, [ order_state, sid])
    res.json(result)
    // db.query(sql, [req.params.id])
    // .then(([results]) => {
    //     res.json(results);
    })




//其他API
// GET商品資料表
router.get('/product', (req, res) => {
    db.query('SELECT * FROM `product` WHERE 1')
        .then(([results]) => {
            res.json(results);
        })
});


// 手機格式
// app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res)=> {
//     let u = req.url.slice(3).split('?')[0];
//     u = u.replace(/-/g, '');
//     res.send(u);
// }); 

//輸出路由
module.exports = router;