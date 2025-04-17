const express = require("express");
const PostRouter = express.Router();
const controller = require("../Controller/PostController")
const commentController = require("../Controller/CommentController")
const {verifyToken} = require("../Middleware/AuthMiddleware.js")

PostRouter.get("/posts/:category", controller.data.SendAllPosts)
    .get("/post/:id",verifyToken,controller.data.SendSinglePost)
    .get("/post/Allcomments/:id",verifyToken,commentController.data.SendComments)
    .post("/create",verifyToken,controller.data.upload.single("image"), controller.data.CreateAPost)
    .put('/Reaction/:id',verifyToken,controller.data.updateReaction)
    .delete("/remove/:id",verifyToken, controller.data.DeletePost)
    .post("/post/comment/:id",verifyToken,controller.data.AddComment)

    
    exports.route = {PostRouter}