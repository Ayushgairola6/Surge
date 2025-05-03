const { generateContext } = require("../SummaryGenerator.js");
const express = require("express");
const router = express.Router()
const { verifyToken } = require("../Middleware/AuthMiddleware.js");

router.post("/post/summary/:id", verifyToken, generateContext)

module.exports = { router };