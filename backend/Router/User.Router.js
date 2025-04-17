const express = require("express");
const UserRouter = express.Router();
const controller = require("../Controller/UserController")
const { verifyToken } = require("../Middleware/AuthMiddleware.js")


UserRouter.get("/account/verify", verifyToken, controller.data.UpdateState)
    .get("/account/data", verifyToken, controller.data.getUser)
    .post("/register", controller.data.Signup)
    .post("/login",controller.data.Login)
    .put("/upload", verifyToken, controller.data.upload.single("image"), controller.data.Upload_profileImage)
    .get("/profile/:id", verifyToken, controller.data.sendProfile)

exports.route = { UserRouter };