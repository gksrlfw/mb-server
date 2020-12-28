const mysql = require('mysql2');
require('dotenv').config();

// 배포용
// const db = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USERNAME,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_NAME,
//   connectionLimit: 5
// });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "eksrja784$",
    database: 'mohobby',
    connectionLimit: 5
});


module.exports = db;
