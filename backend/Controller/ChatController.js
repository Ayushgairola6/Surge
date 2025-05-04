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
  // user joins his own room
  socket.join(user1.toString());


  // like event
  socket.on("like_Post", async (data) => {
    const { post_id, author } = data;
    // console.log(data)
    if (!post_id || !author) return;
    // socket.join(author.toString());

    try {
      // Remove any existing dislike
      await connection.query(`DELETE FROM disliked_posts WHERE post_id = ? AND user_id = ?`, [post_id, socket.user.id]);

      // Check if already liked
      const [liked] = await connection.query(`SELECT * FROM likedPosts WHERE post_id = ? AND user_id = ?`, [post_id, socket.user.id]);

      if (liked.length > 0) {
        // Unlike
        await connection.query(`DELETE FROM likedPosts WHERE post_id = ? AND user_id = ?`, [post_id, socket.user.id]);
      } else {
        // Like
        await connection.query(`INSERT INTO likedPosts (post_id, user_id) VALUES (?, ?)`, [post_id, socket.user.id]);
      }

      // Get both like and dislike counts
      const data = await getUpdatedLikes(post_id)
      // send updates to the user whos post has been liked
      io.to(author.toString()).emit("like_received", { message: "Someone has liked your post" });
      // console.log(socket.user);
      // Emit updated counts
      io.to(socket.user.id.toString()).emit('updateReactionCounts', {
        post: post_id,
        post: post_id,
        likeCount: data?.likecount[0].likeCount,
        dislikeCount: data?.likecount[0].dislikeCount
      });


    } catch (err) {
      console.error("Like error:", err);
    }
  });

  // dislike event
  socket.on("dislike_post", async (data) => {
    const { post_id } = data;
    if (!post_id) return;

    try {
      // Remove like if exists
      await connection.query(`DELETE FROM likedPosts WHERE post_id = ? AND user_id = ?`, [post_id, socket.user.id]);

      // Check if already disliked
      const [disliked] = await connection.query(`SELECT * FROM disliked_posts WHERE post_id = ? AND user_id = ?`, [post_id, socket.user.id]);

      if (disliked.length > 0) {
        // Remove dislike
        await connection.query(`DELETE FROM disliked_posts WHERE post_id = ? AND user_id = ?`, [post_id, socket.user.id]);
      } else {
        // Add dislike
        await connection.query(`INSERT INTO disliked_posts (post_id, user_id) VALUES (?, ?)`, [post_id, socket.user.id]);
      }

      // Get both like and dislike counts
      const data = await getUpdatedLikes(post_id)
      // Emit updated counts
      io.to(socket.user.id.toString()).emit('updateReactionCounts', {
        post: post_id,
        likeCount: data?.likecount[0].likeCount,
        dislikeCount: data?.dislikecount[0].dislikeCount
      });

    } catch (err) {
      console.error("Dislike error:", err);
    }
  });

  //  socket instance for comments 

  socket.on("comment", async (data) => {
    const { text, user_name, post_id } = data;
    if (!text || !user_name || !post_id || !socket.user) {
      return socket.emit("comment_error", { message: "Unable to comment!" });
    }

    await connection.query("INSERT INTO comments (post_id ,comment_body,user_id) VALUES (?,?,?) ", [post_id, text, socket.user.id]);

    io.to(socket.user.id.toString()).emit("New_comment", { username: user_name, comment_body: text });
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
    const { roomName, message, user1, user2, sender_name } = data;
    const sender_id = socket.user.id;
    const receiver_id = user2;

    if (!roomName || !message || !user1 || !user2 || !sender_name) {
      console.log("Some data is missing in the message event");
      return;
    }



    // Insert the new message
    const InsertQuery = `
      INSERT INTO messages (room_name, message, sender_id, receiver_id) 
      VALUES (?, ?, ?, ?)
    `;
    io.to(user2.toString()).emit("message_notify", { message: "New message received", by: sender_name });
    const [insertResponse] = await connection.query(InsertQuery, [roomName, message, sender_id, receiver_id]);
    if (insertResponse.affectedRows > 0) {

      io.to(roomName).emit("newMessage", { roomName, sender_id, receiver_id, message: message, sender_name });
    }
  });


});

async function getUpdatedLikes(post_id) {
  try {
    if (!post_id) return { status: false };

    const [likecount] = await connection.query(`SELECT COUNT(*) AS likeCount FROM likedPosts WHERE post_id = ?`, [post_id]);
    const [dislikecount] = await connection.query(`SELECT COUNT(*) AS dislikeCount FROM disliked_posts WHERE post_id = ?`, [post_id]);
    return { likecount, dislikecount };
  } catch (error) {

  }
}

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
LIMIT 5;

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
