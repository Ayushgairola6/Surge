const db = require("./db")

const CreateUserTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS users ( 
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL ,
     password_hash VARCHAR(100) NOT NULL  ,
     image VARCHAR(500)
    ) `;
    db.data.connection.query(query, (error, results) => {
      if(error){
        throw  error;
      }
      console.log("User table creted")
    })

}

exports.user={CreateUserTable};