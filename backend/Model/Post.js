const db = require("./db")

const CreatePostTable = () => {
    const query = `CREATE TABLE IF NOT EXISTS posts ( 
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255),
     body TEXT ,
     media_urls JSON,
     category VARCHAR(30),
     author INT ,
     hashtags TEXT
    ) ;`

    db.data.connection.query(
        query, (error, results) => {
            if (error) {
                throw error;
            }
            console.log("Posts table creted")
        })
}

exports.post = { CreatePostTable }