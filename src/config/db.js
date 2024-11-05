//db설정

const maria = require("mysql");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// 데이터베이스 connection 객체 생성
const connection = maria.createConnection({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// maria connection 실행
connection.connect((error) => {
  if (error) throw error;
  //console.log("Successfully connected to the database. ");
});

module.exports = connection;
