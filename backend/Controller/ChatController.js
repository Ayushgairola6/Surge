const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const dotenv = require("dotenv").config();
const cors = require('cors');
const db = require("../Model/db.js");
const connection = db.data.PromiseConnection;
const key = process.env.JWT_SECRET_KEY;

// new socket.io server
function InitializeSocketIo(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });

    // middleware to verify the user token
    io.use((socket, next) => {
       
        const token = socket.handshake.auth.token;
        if (token) {
            const confirm = jwt.verify(token, key, (err, res) => {
                if (err) {
                    socket.emit('error', 'Authentication error: Invalid token');
                    console.log(err);
                    return next(new Error('Authentication error'));
                }
                socket.user = res;
                next();
            });
        } else {
            socket.emit('error', 'Authentication error: No token provided');
            next(new Error('Authentication error'));
        }
    });

    // initializing the socket when a user is connected to the socket
    io.on("connection", (socket) => {

        // declared two variables to store usernames that'll be fetched from the database;
        let user1name;
        let user2name;

        // joining a room
        socket.on("joinRoom", async (data) => {
            const { user2Id } = data;

            // Fetch both users from the database
            const searchUser = `SELECT username FROM users WHERE id IN (?, ?)`;
            const [users] = await connection.query(searchUser, [socket.user.id, user2Id]);

            if (!users || users.length < 2) {
                console.log("User not found in database");
                return socket.emit("Error", "No user found");
            }

            // Create a unique room name based on user IDs (ensures order consistency)
            const roomName = `${Math.min(socket.user.id, user2Id)}_with_${Math.max(socket.user.id, user2Id)}`;

            // Check if the room already exists
            const checkRoomQuery = `SELECT id FROM chatRooms WHERE room_name = ?`;
            const [existingRoom] = await connection.query(checkRoomQuery, [roomName]);

            let roomId;
            if (existingRoom.length > 0) {
                roomId = existingRoom[0].id;
            } else {
                // Insert new room only if it doesn’t exist
                const insertRoomQuery = `INSERT INTO chatRooms (room_name) VALUES (?)`;
                const [roomResult] = await connection.query(insertRoomQuery, [roomName]);
                roomId = roomResult.insertId;
            }

            // Join the room
            socket.join(roomName);
            console.log(`User ${users[0].username} joined room ${roomName} to chat with ${users[1].username}`);

            // Emit the room name and ID back to the client
            socket.emit("roomJoined", { username: users[0].username, roomName, roomId, userId: socket.user.id, user2Id });
        });

        // Receiving messages from client
        socket.on("message", async (data) => {
            const { roomName, user, message, id, user2Id } = data;

            // Get the room ID from the room name
            const getRoomQuery = `SELECT id FROM chatRooms WHERE room_name = ?`;
            const [roomData] = await connection.query(getRoomQuery, [roomName]);

            if (roomData.length === 0) {
                console.log("Error: Room does not exist");
                return socket.emit("Error", "Room not found");
            }

            const roomId = roomData[0].id;

            // Insert message into the chatDetails table
            const insertMessageQuery = "INSERT INTO chatDetails (room_id, user_id, message, receiver_id) VALUES (?, ?, ?, ?);"
            const [result] = await connection.query(insertMessageQuery, [roomId, id, message, user2Id]);

            if (result.affectedRows === 0) {
                console.log("Error inserting message into the database");
                return socket.emit("Error", "Message not stored");
            }

            // Emit message to all users in the room
            io.to(roomName).emit("message", { username: user, message, roomName });
        });

// this socket will take room_name and will look for room_name in the database which is obviously going to be there!
        // creating chatRoom via room_name method
        socket.on("joinByRoomName", async (data) => {
            const { roomName,userid,roomid} = data;

   


            // Check if the room exists in the DB
            const checkRoomQuery = `SELECT id FROM chatRooms WHERE room_name = ?`;
            const [existingRoom] = await connection.query(checkRoomQuery, [roomName]);

            if (existingRoom.length > 0) {
                // Assign room name to a socket property (if you need to reference it later)
                socket.currentRoom = roomName;
                socket.join(roomName);
                console.log(`User ${socket.user.id} joined room ${roomName} via room name`);
                socket.emit("roomJoinedByName", { roomName, roomId: existingRoom[0].id });
            } else {
                socket.emit("Error", "Room not found");
            }
        });

        // New event to handle messages for the room name approach
        socket.on("room_message", async (data) => {
            const { userid, message ,roomName,roomId} = data;

 let reciever;
                 //find the receiver_id from the last message in the table
          const findReciever = ` SELECT user_id, receiver_id, message
                FROM chatDetails
                WHERE room_id = ?
                ORDER BY sent_at DESC
                LIMIT 1;`
          const [reciver] = await connection.query(findReciever,[roomId])
     // check who the fuck is going to be the user 

    if(reciver.length >0){
        if(reciver[0].receiver_id === userid){
            reciever = reciver[0].user_id
        }else{
            reciever = reciver[0].receiver_id
        }
    }


console.log(reciever,'receiver_id');
            // You can either use socket.currentRoom or extract it from the data if you send it
            console.log(data)
            if (!roomName) {
                return socket.emit("Error", "No room joined");
            }
            console.log(userid,message);
            // Insert message into your DB if needed here
            const InsertMessage = "INSERT INTO chatDetails (room_id, user_id, message, receiver_id) VALUES (?, ?, ?, ?);"
            const [data2] = await connection.query(InsertMessage,[roomId, userid, message, reciever])
            // Then emit the message to everyone in the room
            
            io.to(roomName).emit("room_message", { username: userid, message, roomName });
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log(`${socket.user.id} user disconnected`);
        });
    });
}

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

        const query = ` SELECT DISTINCT cr.id AS room_id, cr.room_name
        FROM chatDetails cd
        JOIN chatRooms cr ON cd.room_id = cr.id
        WHERE cd.user_id = ? OR cd.receiver_id = ?; `;
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
        const query = `SELECT users.username, chatDetails.message, chatDetails.user_id, chatDetails.receiver_id
        FROM chatDetails
        JOIN users ON chatDetails.user_id = users.id OR chatDetails.receiver_id = users.id
        JOIN chatRooms ON chatRooms.id = chatDetails.room_id
        WHERE chatRooms.room_name = ?;`;

        const [data] = await connection.query(query, [room_name]);
        // console.log([data]);

        if (!data || data.length === 0) {
            return res.status(400).json({ message: "No data found" });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}

exports.data = { InitializeSocketIo, GetChatData, GetChatRooms };
