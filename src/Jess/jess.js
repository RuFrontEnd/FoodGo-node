const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment=require('moment-timezone');
const { now } = require('moment-timezone');
const db = require(__dirname + '/../db_connect');

//會員狀態
router.get("/allUserProfile", (req, res) => {
  db.query("SELECT * FROM member_list").then(([results, fields]) => {
    res.json(results);
  });
});



//連線bento資料庫
router.get('/bento', (req, res) => {
  db.query('SELECT * FROM `product` WHERE 1')
    .then(([results]) => {
      res.json(results);
    })
});

//連線message資料庫
router.get('/message', (req, res) => {
  db.query('SELECT * FROM `message` WHERE 1')
    .then(([results]) => {
      res.json(results);
    })
});


//嫩雞胸的所有資料，包含會員姓名（JessListD
router.get("/bentoMsg", async (req, res) => {
  const output = { total:[]}
  let sql = `SELECT member_list.name,member_list.member_sid,message.sid,message.content,message.product_sid,message.created_at,message.starRating FROM message INNER JOIN member_list on member_list.member_sid=message.member_sid WHERE product_sid=1 ORDER BY sid DESC`
  const [r2] = await db.query(sql)
  r2.forEach(element => {
    element.created_at = moment(element.created_at).format("YYYY-MM-DD HH:mm:ss")
  });
  // console.log(r2)
  output.total=r2
  res.json(r2)
})

//取得會員1的留言
router.get("/member1msg2", async (req, res) => {
  const output = { total:[]}
  let sql = `SELECT  message.sid,message.content,message.starRating,message.product_sid,message.created_at,message.member_sid,product.productname FROM message INNER JOIN product on message.product_sid=product.sid WHERE member_sid=1 ORDER BY sid DESC LIMIT 2`
  const [r2] = await db.query(sql)
  r2.forEach(element => {
    element.created_at = moment(element.created_at ).format('YYYY-MM-DD HH:mm:ss')
  });
  // console.log(r2)
  output.total=r2
  res.json(r2)
})

//取得會員1的留言
router.get("/member1msg", async (req, res) => {
  const output = { total:[]}
  let sql = `SELECT * FROM message WHERE member_sid=1 ORDER BY sid DESC LIMIT 3`
  const [r2] = await db.query(sql)
  r2.forEach(element => {
    element.created_at = moment(element.created_at ).format("YYYY-MM-DD HH:mm:ss")
  });
  // console.log(r2)
  output.total=r2
  res.json(r2)
})



//會員sid-1 POST
router.post('/member1msg', (req, res) => {
  const newMessage = req.body;
  console.log(newMessage);
  const sql= "INSERT INTO `message` (  `product_sid`,`starRating`, `content`, `member_sid`) VALUES ( '"+newMessage.product_sid+"','"+newMessage.starRating+"', '"+newMessage.content+"', '"+newMessage.member_sid+"')"
  db.query(sql);
  res.json(newMessage);
});






// 只取sid=1
router.get('/productSid', (req, res) => {
  db.query('SELECT * FROM `message` WHERE product_sid=1 LIMIT 5')
    .then(([results]) => {
      res.json(results);
    })
});









// //message的分頁

    

//   "SELECT COUNT(1) totalRows FROM `message` WHERE product_sid=1"
  //desctructor  總筆數
  //這裡只取第一個值  還是arrary
//   const [ [totalRows] ] = await db.query(
//     `SELECT COUNT(1) totalRows FROM message  WHERE product_sid=1`
//   );
//   console.log(totalRows);

//   if (totalRows > 0) {
//     //沒有輸入值就是1  轉換成整數
//     let page = parseInt(req.query.page) || 1
//     output.totalRows = totalRows
//     //會回傳大於等於所給數字的最小整數
//     output.totalPages = Math.ceil(totalRows / output.perPage)

//     //拿到的值做判斷
//     if (page < 1) {
//       output.page = 1
//     } else if (page > output.totalPages) {
//       output.page = totalPages
//     } else {
//       output.page = page
//     }
//     // //分頁資料 //起始位置
//     let sql = `SELECT * FROM message ORDER BY sid DESC LIMIT ${(output.page - 1) * output.perPage
//       }, ${output.perPage}`

//     const [r2] = await db.query(sql);
//     output.rows = r2
//   }
//   return output;
// }

// router.get("/productSid2", async (req, res) => {
//   res.json(await getListData(req))
// })



module.exports = router;
