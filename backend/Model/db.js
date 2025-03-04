const mySql = require("mysql2");
require("dotenv").config();
const fs = require('fs');
// mySql database connection 
const connection = mySql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  connectTimeout: 50000,
  ssl: { 
    rejectUnauthorized: false
  }
});

  //  host:"localhost",
    // port:"3306",
    // user:"Ayushgairola",
    // password:"Ayush@2002",
    // database:"test",
connection.connect((error)=>{
    if(error){
        console.log(`error connecting to the database : ${error}`)
        return;
    }
    console.log("connected to the mysql database")
})
const PromiseConnection = connection.promise();

exports.data = {connection,PromiseConnection};