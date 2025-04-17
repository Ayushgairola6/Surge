const  db  = require("./db")


const createCommentTable = () => {
    const query = ` CREATE TABLE IF NOT EXISTS comments (
     id INT PRIMARY KEY UNIQUE AUTO_INCREMENT,
     post_id INT NOT NULL,
     user_id INT NOT NULL,
     comment_body TEXT NOT NULL ,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ;
    `
    db.data.connection.query(query, (error, results) => {
        if(error){
            console.log(error)
          throw error;
        }
        console.log("Comments table creted")
      })
}

exports.comment= {createCommentTable} 