const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,      
  user: process.env.DB_USER,          
  password: process.env.DB_PASS,   
  database: process.env.DB_NAME 
});

connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối đến MySQL:', err.stack);
    return;
  }
  console.log('Kết nối thành công với MySQL ID:', connection.threadId);
});

module.exports = connection;
