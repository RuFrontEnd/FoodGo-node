const express = require('express');
const app = express();

app.use( express.urlencoded({extended: false}));
app.use( express.json());



// Server 偵聽
app.listen(process.env.PORT || 5000, ()=>{
    console.log('伺服器已啟動...');
})