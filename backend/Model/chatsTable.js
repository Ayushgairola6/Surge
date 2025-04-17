const  db  = require("./db")


const createChatsTable = ()=>{
	const query= `CREATE TABLE IF NOT EXISTS chatRooms (
  id INT AUTO_INCREMENT PRIMARY KEY, -- Unique room ID
  room_name VARCHAR(255) NOT NULL, -- Optional: Human-readable name for the room
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

	db.data.connection.query(query, (error, results) => {
        if(error){
            console.log(error)
          throw error;
        }
        console.log("chatRooms table created");
      })
}

  
exports.data = {createChatsTable}