const express = require("express");
const Server = express();
const cors = require('cors');
const bodyParser = require('body-parser');
// cross origin 
Server.use(cors({origin:"*"}));
// parsing the data
Server.use(express.text());
Server.use(bodyParser.json());
Server.use(bodyParser.urlencoded({ extended: true }));
const Post = require("./Router/PostRouter");
const User = require("./Router/User.Router");

// importing all the tables
const user_Table = require("./Model/User")
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



// Routes to access the api
Server.use("/api/feed", Post.route.PostRouter);
Server.use("/api/user", User.route.UserRouter);




Server.listen(8080, () => {
    console.log('server connected')
})





