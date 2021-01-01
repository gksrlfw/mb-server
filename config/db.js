const mysql = require('mysql2');
require('dotenv').config();

// 배포용
let option = {};
if(process.env.NODE_ENV === 'production') {
    option = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_NAME,
        connectionLimit: 5,
        dateStrings: 'date'
    }
}
else {
   option = {
        host: process.env.DEV_HOST,
        user: process.env.DEV_USERNAME,
        password: process.env.DEV_PASSWORD,
        database: process.env.DEV_NAME,
        connectionLimit: 5,
        dateStrings: 'date'
    }
}

const db = mysql.createConnection(option);

module.exports = db;
