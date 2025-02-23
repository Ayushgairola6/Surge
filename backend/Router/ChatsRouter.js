const controller = require("../controller/ChatController");
const express = require("express");
const chatRouter = express.Router();


chatRouter.get("/all/data/",controller.data.GetChatRooms)
.get("/chats/:room_name",controller.data.GetChatData);

exports.route = {chatRouter};