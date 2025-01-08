const express = require("express");
const PostRouter = express.Router();
const controller = require("../Controller/PostController")
const commentController = require("../Controller/CommentController")

PostRouter.get("/posts/:category", controller.data.SendAllPosts)
    .get("/post/:id", controller.data.SendSinglePost)
    .get("/post/Allcomments/:id",commentController.data.SendComments)
    .post("/create",controller.data.upload.single("image"), controller.data.CreateAPost)
    .patch('/Reaction/:id',controller.data.updateReaction)
    .delete("/remove/:id", controller.data.DeletePost)
    .post("/post/comment/:id",controller.data.AddComment)

    
    exports.route = {PostRouter}