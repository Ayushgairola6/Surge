const mySql = require("mysql2");

// mySql database connection 
const connection = mySql.createConnection({
    host:"localhost",
    user:"root",
    password:"Ayush@2002",
    database:"test"
})

connection.connect((error)=>{
    if(error){
        console.log(`error connecting to the database : ${error}`)
        return;
    }
    console.log("connected to the mysql database")
})
const PromiseConnection = connection.promise();

exports.data = {connection,PromiseConnection};