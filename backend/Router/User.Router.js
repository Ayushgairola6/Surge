const express = require("express");
const UserRouter = express.Router();
const controller = require("../Controller/UserController")


UserRouter.get("/account/data", controller.data.getUser)
    .post("/register", controller.data.Signup)
    .post("/login", controller.data.Login)
    .patch("/upload",controller.data.upload.single("image"),controller.data.Upload_profileImage)
.get("/profile/:id",controller.data.sendProfile)

    exports.route = {UserRouter};