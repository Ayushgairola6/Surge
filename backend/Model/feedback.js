const db = require("./db")

const createFeedbackTable = async () => {
    try {
        const query = `create table  if not exists feedback(
        id INT AUTO_INCREMENT PRIMARY KEY,
        body text not null,
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        
        )`

        db.data.connection.query(query, (error) => {
            if (error) {
                console.log(error)
                throw error;
            }
            console.log("feedback table created")
        });
    } catch (error) {
        console.log(error);
    }
}
createFeedbackTable()
module.exports = {createFeedbackTable};