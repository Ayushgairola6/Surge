const  db  = require("./db")


const createChatsRoomTable = ()=>{
	const query= `CREATE TABLE IF NOT EXISTS chatDetails (
  id INT AUTO_INCREMENT PRIMARY KEY, -- Unique message ID
  room_id INT NOT NULL, 
  user_id INT NOT NULL, 
  receiver_id INT NOT NULL ,
  message TEXT NOT NULL, 
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY (room_id) REFERENCES chatRooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE


	)`

	db.data.connection.query(query, (error, results) => {
        if(error){
            console.log(error)
          throw error;
        }
        console.log("chatroomdetails table created");
      })
}

  
exports.data = {createChatsRoomTable}