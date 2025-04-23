const { recieveFeedback } = require("../Controller/feedbackCOntroller");
const express = require("express");
const Feedback_router = express.Router();
const { verifyToken } = require("../Middleware/AuthMiddleware.js")


Feedback_router.post("/feedback", verifyToken, recieveFeedback);

module.exports = {Feedback_router};