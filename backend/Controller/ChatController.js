const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const cors = require('cors');
const db = require("../Model/db.js");
const connection = db.data.PromiseConnection;
const key = process.env.JWT_SECRET_KEY;
const { io } = require("../index.js");

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      console.log("Error while verification");
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = decoded;
    next();
  });
});

// client sends a connection event and we receive it
io.on("connection", (socket) => {
  const user1 = socket.user.id;
  const user1name = socket.user.name;
  let roomName;
  
  socket.on("joinChat", (user2) => {
    if (!user2 || !user2.selectedUser) {
      console.log("User2 not found");
      return socket.disconnect();
    }
    
    const sortedIds = [user1, user2.selectedUser].sort().join("_");
    roomName = `chat_${sortedIds}`;

    socket.join(roomName);
    io.to(roomName).emit("roomJoined", { roomName, user1, user2: user2.selectedUser.id });
  });

  socket.on("message", async (data) => {
    if (!data.roomName) {
      console.log("User not in a room");
      return;
    }

    const { roomName, message, user1, user2,sender_name } = data;
    const sender_id = user1;
    const receiver_id = user2;

    

    
      

    // Insert the new message
    const InsertQuery = `
      INSERT INTO messages (room_name, message, sender_id, receiver_id) 
      VALUES (?, ?, ?, ?)
    `;

    const [insertResponse] = await connection.query(InsertQuery, [roomName, message, sender_id, receiver_id]);
    if (insertResponse.affectedRows > 0) {
      io.to(roomName).emit("newMessage", { sender_id, receiver_id, message: message,sender_name });
    }
  });
  
  
});



// get chat data method
async function GetChatRooms(req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            console.log("No user token found in the headers");
            return res.status(400).json({ message: "No token found" });
        }
        let User_id = null;
        const decoded = jwt.verify(token, key, (err, result) => {
            if (err) {
                return err
            }
            User_id = result.id;
        });

        const query = ` SELECT DISTINCT room_name FROM messages WHERE sender_id = ? OR receiver_id = ? `;
        const [Rooms] = await connection.query(query, [User_id, User_id]);
        // console.log([Rooms]);

        if ( Rooms.length === 0) {
            console.log("No rooms found with user id");
            return res.status(400).json("No results rooms find");
        }

        return res.status(200).json(Rooms);

    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}

// get chatdata wrt to the roomId and participants
async function GetChatData(req, res) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let id = null;
        const room_name = req.params.room_name;

        if (!room_name) {
            return res.status(400).json({ message: "no room_name found" });
        }
        const verified = jwt.verify(token, key, (error, result) => {
            if (error) {
                throw error;
                return res.status(400).json({ message: "user not verified" });
            }
            id = result.id;
        });

        if (!id) {
            console.log("No room id found");
            return res.status(400).json({ message: "Room id not find" });
        }

        // find all chats related to the room_name because each room_name has an id which has been stored in the chatDetails table
        const query = `SELECT 
  sender.username AS sender_name, 
  receiver.username AS receiver_name, 
  messages.message, 
  messages.sender_id, 
  messages.receiver_id,
  messages.sent_at
FROM messages
JOIN users AS sender ON messages.sender_id = sender.id
JOIN users AS receiver ON messages.receiver_id = receiver.id
WHERE messages.room_name = ?
ORDER BY messages.sent_at DESC
LIMIT 20;

`;

        const [data] = await connection.query(query, [room_name]);
        // console.log([data]);

        if (!data || data.length === 0) {
            return res.status(400).json({ message: "No data found" });
        }
  const sotedMessage = data.reverse();
        return res.status(200).json(sotedMessage);

    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}

exports.data = {  GetChatData, GetChatRooms };
