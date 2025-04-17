const db = require("../Model/db");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const secretKey = process.env.JWT_SECRET_KEY;
const connection = db.data.PromiseConnection; 




async function SendComments(req,res){
	try{
          const postId = req.params.id;
     
          const userId = req.user.id;


           if(!userId){
            console.log('no userid')
            return res.status(400).json('no user id found')
           }
       const Comments_query = `SELECT comments.comment_body,comments.user_id,comments.post_id,users.username FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.post_id = ? LIMIT 5`;          
      const [response] = await connection.query(Comments_query,postId);
         
 
      return res.status(200).json(response);


	}
	catch(err){
		console.log(err)
		throw err;
	}
}

exports.data = {SendComments}