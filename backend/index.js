const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser');
const {createServer } = require("http");
const httpServer = createServer(app);
// const websocket = require("../controller/chatController")
// cross origin 
app.use(cors({origin:"*"}));
// parsing the data
app.use(express.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Post = require("./Router/PostRouter");
const User = require("./Router/User.Router");
const Chats = require("./Router/ChatsRouter.js");
// importing all the tables
const user_Table = require("./Model/User")
const chatsTable = require("./Model/chatsTable");

const chatRoom = require("./Model/chatRooms");

const comment_Table = require("./Model/Comments")
const likedPost_Table = require("./Model/likedPosts")
const Post_Table = require("./Model/Post")
const dislikedPost_table = require("./Model/dislikedPosts");
// initializing  table creation
user_Table.user.CreateUserTable();
comment_Table.comment.createCommentTable();
Post_Table.post.CreatePostTable();
likedPost_Table.liked.CreateLikedPostTable();
dislikedPost_table.disliked.CreateDislikePostTable();
chatsTable.data.createChatsTable();

chatRoom.data.createChatsRoomTable();

// Routes to access the api
app.use("/api/feed", Post.route.PostRouter);
app.use("/api/user", User.route.UserRouter);
app.use("/api/chats",Chats.route.chatRouter);




// node server connection

app.listen(process.env.PORT,'0.0.0.0', () => {
    console.log('server connected')
})




httpServer.listen(4000,()=>{
        console.log("socket.io connection running on port 4000");
    });

