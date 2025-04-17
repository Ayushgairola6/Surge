const controller = require("../Controller/ChatController.js");
const express = require("express");
const chatRouter = express.Router();
const {verifyToken} = require("../Middleware/AuthMiddleware.js")

chatRouter.get("/all/data/",verifyToken,controller.data.GetChatRooms)
.get("/chats/:room_name",verifyToken,controller.data.GetChatData);

exports.route = {chatRouter};