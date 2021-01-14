const mysql = require('mysql2');
require('dotenv').config();

// 배포용
let option = {}, option_docker = {};
if(process.env.NODE_ENV === 'production') {
    option = {
        host: process.env.PROD_HOST,
        user: process.env.PROD_USERNAME,
        password: process.env.PROD_PASSWORD,
        database: process.env.PROD_NAME,
        port: process.env.PROD_PORT,
        connectionLimit: 5,
        dateStrings: 'date'
    }
}
else {
    option = {
        host: process.env.DEV_LOCAL_HOST,
        user: process.env.DEV_LOCAL_USERNAME,
        password: process.env.DEV_LOCAL_PASSWORD,
        database: process.env.DEV_LOCAL_NAME,
        port: 3306,
        connectionLimit: 5,
        dateStrings: 'date'
    }
}

// 로컬일때, 192.~~ 일때로 나눈다
option_docker = {
    host: process.env.DEV_HOST,
    user: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_NAME,
    port: 3306,
    connectionLimit: 5,
    dateStrings: 'date'
}

console.log('db options: ', option);
const db = mysql.createConnection(option);

module.exports = db;
