//引入express
const express = require('express');

//引入router
const router = express.Router();

//引入需要用的套件
const { v4: uuidv4 } = require('uuid');

//路由名稱+功能
router.get('/try-uuid', (req, res) => {
    res.json({
        uuid1: uuidv4(),
        uuid2: uuidv4(),
    });
});


//輸出路由
module.exports = router;

//網址列輸入 localhost:5000/example/try-uuid 看結果