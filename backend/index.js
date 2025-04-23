const express = require("express");
const app = express();
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require("http");
const httpServer = http.createServer(app);
const cookies = require("cookie-parser");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
require("./query.js");
dotenv.config();
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "https://surge-lake.vercel.app"], credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
app.use(cookies());




module.exports = { io, httpServer };

// cross origin 
app.use(cors({
    origin: ["http://localhost:3000", "https://surge-lake.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

// parsing the data
// app.use(express.text());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Post = require("./Router/PostRouter");
const User = require("./Router/User.Router");
const Chats = require("./Router/ChatsRouter.js");
const { Feedback_router } = require("./Router/feedbackRouter.js");
// importing all the tables
const user_Table = require("./Model/User")

const messages = require("./Model/Messages.js");

const comment_Table = require("./Model/Comments")
const likedPost_Table = require("./Model/likedPosts")
const Post_Table = require("./Model/Post")
const dislikedPost_table = require("./Model/dislikedPosts");
const {createFeedbackTable}  =require("./Model/feedback.js")
// initializing  table creation
user_Table.user.CreateUserTable();
comment_Table.comment.createCommentTable();
Post_Table.post.CreatePostTable();
likedPost_Table.liked.CreateLikedPostTable();
dislikedPost_table.disliked.CreateDislikePostTable();
messages.data.createMessagesTable()

// Routes to access the api
app.use("/api/feed", Post.route.PostRouter);
app.use("/api/user", User.route.UserRouter);
app.use("/api/chats", Chats.route.chatRouter);
app.use("/api", Feedback_router);

// Auth middleWare


// node server connection

httpServer.listen(process.env.PORT ? process.env.PORT : 8080, '0.0.0.0', () => {
    console.log('server connected')
})




