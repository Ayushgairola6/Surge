const  db  = require("./db")


const createMessagesTable = ()=>{
	const query= `CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY, -- Unique message ID
  sender_id INT NOT NULL, 
  receiver_id INT NOT NULL ,
  message TEXT NOT NULL,
  room_name TEXT, 
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE



	)`
	db.data.connection.query(query, (error, results) => {
        if(error){
            console.log(error)
          throw error;
        }
        console.log("messages table created");
      })

    
}

  
exports.data = {createMessagesTable}