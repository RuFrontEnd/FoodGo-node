// require('dotenv').config();  //管理資料庫帳密

const express = require('express');  //引入 express
// const multer = require('multer');
// const fs = require('fs');
// const {v4: uuidv4} = require('uuid');
// const axios = require('axios');
// const jwt = require('jsonwebtoken');
// const session = require('express-session');
// const MysqlStore = require('express-mysql-session')(session);
// const moment = require('moment-timezone');
// const cors = require('cors');
// const upload = multer({dest: __dirname + '/../tmp_uploads'});

// // 建立 web server 物件
const app = express();

app.use( express.urlencoded({extended: false}));
app.use( express.json() );







// app.use( express.static,require(__dirname + '/public'));
// app.use( '/login-api',require(__dirname + '/src/Cha/cha'));
// app.use( '/login-api',require(__dirname + '/src/Cha/cha'));
// app.use( '/login-api',require(__dirname + '/src/Cha/cha'));
// app.use( '/login-api',require(__dirname + '/src/Cha/cha'));
// app.use( '/login-api',require(__dirname + '/src/Cha/cha'));




//使用靜態內容的資料夾
// app.use( express.static(__dirname + '/../public'));


// Server 偵聽
app.listen(process.env.PORT || 5000, ()=>{
    console.log('伺服器已啟動...');
})