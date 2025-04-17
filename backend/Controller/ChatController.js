const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const cors = require('cors');
const db = require("../Model/db.js");
const connection = db.data.PromiseConnection;
const key = process.env.JWT_SECRET_KEY;
const { io } = require("../index.js");
const cookie = require("cookie")

// verifying the user before giving them access to the socket room
io.use((socket, next) => {
  try {
    // Parse cookies safely
    const cookies = socket.handshake.headers.cookie ? cookie.parse(socket.handshake.headers.cookie) : {};
    const tokenFromCookie = cookies["auth_token"];
    const tokenFromAuth = socket.handshake.auth?.token; // Handle missing auth field safely

    const finalToken = tokenFromCookie || tokenFromAuth; // Prefer cookies but fallback to auth token
    if (!finalToken) {
      return next(new Error("Authentication error: No token provided"));
    }
    // Verify JWT token
    jwt.verify(finalToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log("Error while verifying token:", err.message);
        return next(new Error("Authentication error: Invalid token"));
      }
      socket.user = decoded; // Attach user info to socket
      next();
    });
  } catch (err) {
    console.error("Socket middleware error:", err.message);
    next(new Error("Internal Server Error"));
  }
});

// client sends a connection event and we receive it
io.on("connection", (socket) => {
  const user1 = socket.user.id;
  socket.join(user1,()=>{
    console.log(`${socket.user} has joined the room`)
  });




   socket.on("like_Post",(data)=>{
    console.log("post liked event has been received",data);
   })







  const user1name = socket.user.name;
  let roomName;

  socket.on("joinChat", (user2) => {
    if (!user2 || !user2.selectedUser) {
      return socket.disconnect();
    }

    const sortedIds = [user1, user2.selectedUser].sort().join("_");
    roomName = `chat_${sortedIds}`;

    socket.join(roomName);
    io.to(roomName).emit("roomJoined", { roomName, user1, user2: user2.selectedUser.id });
  });

  socket.on("message", async (data) => {
    if (!data.roomName) {
      return;
    }

    const { roomName, message, user1, user2, sender_name } = data;
    const sender_id = user1;
    const receiver_id = user2;






    // Insert the new message
    const InsertQuery = `
      INSERT INTO messages (room_name, message, sender_id, receiver_id) 
      VALUES (?, ?, ?, ?)
    `;

    const [insertResponse] = await connection.query(InsertQuery, [roomName, message, sender_id, receiver_id]);
    if (insertResponse.affectedRows > 0) {
      io.to(roomName).emit("newMessage", { roomName, sender_id, receiver_id, message: message, sender_name });
    }
  });


});



// get chat data method
async function GetChatRooms(req, res) {
  try {
    let User_id = req.user.id;

    if (!User_id) return res.status(400).json({ message: "No user id found" });

    const query = ` SELECT DISTINCT 
  m.room_name,
  u.image,
  u.username
FROM messages m
LEFT JOIN users u 
  ON (
       (m.sender_id = ? AND u.id = m.receiver_id)
    OR (m.receiver_id = ? AND u.id = m.sender_id)
  )
WHERE m.sender_id = ? 
   OR m.receiver_id = ?;
`;
    const [Rooms] = await connection.query(query, [User_id, User_id, User_id, User_id]);

    // console.log([Rooms]);

    if (Rooms.length === 0) {
      console.log("No rooms found with user id");
      return res.status(400).json(Rooms);
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
    let id = req.user.id;
    const room_name = req.params.room_name;

    if (!room_name) {
      return res.status(400).json({ message: "no room_name found" });
    }


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

    const sotedMessage = data.reverse();
    return res.status(200).json(sotedMessage);

  } catch (error) {
    console.log(error);
    throw new Error(`${error}`);
  }
}

exports.data = { GetChatData, GetChatRooms };
