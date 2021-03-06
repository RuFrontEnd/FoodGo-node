// 連線模組
require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "group_c_db",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//   });

module.exports = pool.promise();
