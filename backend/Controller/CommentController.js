const db = require("../Model/db");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const secretKey = process.env.JWT_SECRET_KEY;
const connection = db.data.PromiseConnection; 




async function SendComments(req,res){
	try{
          const postId = req.params.id;
          const token = req.headers.authorization.split(" ")[1];

                          if (!token) {
                    console.log("no token")
                    return res.status(400).json("no token found");
                }

          const decoded = jwt.decode(token,secretKey);

                if (!decoded || !decoded.id) {
            console.log("jwt decode error");
            return res.status(400).json("Invalid token or user data not found");
        }
          const userId = decoded.id;


           if(!userId){
            console.log('no userid')
            return res.status(400).json('no user id found')
           }
       const Comments_query = `SELECT comments.comment_body,comments.user_id,comments.post_id,users.username FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.post_id = ?`;          
      const [response] = await connection.query(Comments_query,postId);
      console.log(response)
         
 
      return res.status(200).json(response);


	}
	catch(err){
		console.log(err)
		throw err;
	}
}

exports.data = {SendComments}