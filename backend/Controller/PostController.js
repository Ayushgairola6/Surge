        const db = require("../Model/db");
        const multer = require("multer");
        const jwt = require("jsonwebtoken");
        const PostModel = require("../Model/Post");
        const dotenv = require("dotenv").config();
        const secretKey = process.env.JWT_SECRET_KEY;
        const connection = db.data.PromiseConnection;
        const { uploadToFirebase, deleteImage } = require('../Config/FirebaseAdmin.js')

        const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 5 } })

        // send all posts


        async function SendAllPosts(req, res) {
            try {
                let category = req.params.category;
                if (!category) {
                    console.log("category error");
                    return res.status(400).json("please choose a category")
                }

                const query = `SELECT * FROM posts WHERE category = ?`
                const [Posts] = await connection.query(query, category)
                if (!Posts) {
                    return res.status(400).send("No Post found");
                }
                // console.log(Posts);
                res.status(200).send(Posts)
            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        // send posts based on ID
        async function SendSinglePost(req, res) {
            try {
                const token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.decode(token,secretKey);
                const userId = decoded.id;
                const postId = req.params.id;

                if(!userId){
                    console.log("no userid")
                    return res.status(400).json("user not found");
                }
                // sending the asked post
                const query = `SELECT * FROM posts WHERE id = ? ;`
                const [post] = await connection.query(query, postId);
                if(!post){
                    console.log('post not found in single post')
                    return res.status(400).json("post not found")
                }
              return   res.status(200).send(post);
            } catch (error) {
                console.log(error);
                throw  error;
            }
        }
        // create post

        async function CreateAPost(req, res) {

            try {
                let image ;
                if(req.file){
                    image = req.file
                }else{
                    image = " "
                }


                let imageUrl;
                // token sent by the user
                const token = req.headers.authorization.split(' ')[1]
                if (!token) {
                    console.log("no token")
                    return res.status(400).json("no token found");
                }
                const decoded = jwt.decode(token, secretKey)
                if (!decoded) {
                    return res.status(400).json("couldnt find the data")
                }
                const Id = decoded.id;

                if(!Id){
                    console.log("no user found")
                    return res.status(400).json("no userid in token")
                }
                // uploading media to firebase
                if(image  && image !== " ")
                { imageUrl = await uploadToFirebase(image,"BlogPosts")
                       if(!imageUrl){
                           console.log("url will be empty");
                            res.status(400).json("No image detected");                          }
                       }
                       // Insert query
                       let category ;
                    if(req.body.category === ""){
                        category = "other"
                    }

                     category = req.body.category;
                const query = `INSERT INTO posts (title,body,image,category,author) VALUES ( ? , ? , ? , ? , ?)`

                const [Post] = await connection.query(query, [req.body.title, req.body.caption, imageUrl, category, Id]);

                // fetch query
                const fetchQuery = ` SELECT * FROM posts WHERE id = ?`
                const [result] = await connection.query(fetchQuery, Post.insertId)
                if (!result) {
                    return res.status(400).json({ message: "there is some server error" })
                }



                return res.status(200).json(result);

            } catch (error) {
                console.log(error);
                throw error;
            }
        }

        // delete A post

        async function DeletePost(req, res) {
            try {
                const postId = req.params.id;
                // check if the post if post id is sent or not
                if (!postId) {
                    return res.status(401).send("no post id found");
                }

                // search query 

                 const search = ` SELECT * FROM posts WHERE id = ?`
                 const [response] = await connection.query(search.postId); 
         
                  if(!response){
                    console.log("no image url in db");
                     res.status(400).json("Image not found in our database");
                  }

               // deleting image from firebase
                  const imageToDelete = await deleteImage(response.image,"BlogPosts");
                  
                  if(!imageToDelete){
                    console.log("firebase image deletion error");
                    res.status(400).json("error deleting image from cloud");
                  }

                // query to delete a post
                const query = `DELETE FROM posts WHERE id = ? ;`
                const [result] = await connection.query(query, req.params.id);
             
                return res.status(201).json({ message: "post has been deleted" });

            } catch (error) {
                console.log(error);
                throw error;
            }
        }


        // userReaction function 

  
async function updateReaction(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            console.log("no token found");
            return res.status(401).json("Authorization token is missing");
        }

        const postId = req.params.id;
        const decoded = jwt.decode(token, secretKey);

        if (!decoded || !decoded.id) {
            console.log("jwt decode error");
            return res.status(400).json("Invalid token or user data not found");
        }

        const userId = decoded.id;

        // 1. Check if the post exists 
        const postQuery = `SELECT * FROM posts WHERE id = ?`;
        const [postResult] = await connection.query(postQuery, [postId]);
        if (postResult.length === 0) {
            console.log("no such post found");
            return res.status(404).json("Post not found");
        }

        // 2. Check if the post_id is in likedPosts
        const likedPostCheckQuery = `SELECT * FROM likedPosts WHERE post_id = ? AND user_id = ?`;
        const [likedResponse] = await connection.query(likedPostCheckQuery, [postId, userId]);

        if (likedResponse.length > 0) {

            // Remove the post id and user id from likedPosts
            const deleteLikedQuery = `DELETE FROM likedPosts WHERE post_id = ? AND user_id = ?`;
            const [deletedLiked] = await connection.query(deleteLikedQuery, [postId, userId]);

            if (!deletedLiked) {
                console.log("error deleting post id || user id from the likedPosts table");
                return res.status(400).json("error while disliking");
            }

            // Insert the post id with user id in the dislikedPosts
            const insertIntoDislikedPosts = `INSERT INTO disliked_posts (post_id, user_id) VALUES (?, ?)`;
            const [dislikedPost] = await connection.query(insertIntoDislikedPosts, [postId, userId]);

            if (!dislikedPost) {
                console.log('error while inserting in dislikedPosts');
                return res.status(400).json("error inserting in dislikedPosts");
            }
            return res.status(200).json(dislikedPost);
        } else {
            // 3. Check if the post_id is in dislikedPosts
            const dislikedPostsCheckQuery = `SELECT * FROM disliked_posts WHERE post_id = ? AND user_id = ?`;
            const [dislikedResponse] = await connection.query(dislikedPostsCheckQuery, [postId, userId]);

            if (dislikedResponse.length > 0) {
                console.log("post already disliked");

                // Remove the post id and user id from dislikedPosts
                const deleteDislikedQuery = `DELETE FROM disliked_posts WHERE post_id = ? AND user_id = ?`;
                const [deletedDisliked] = await connection.query(deleteDislikedQuery, [postId, userId]);

                if (!deletedDisliked) {
                    console.log("error deleting post id || user id from the dislikedPosts table");
                    return res.status(400).json("error while liking");
                }

                // Insert the post id with user id in the likedPosts
                const insertIntoLikedPosts = `INSERT INTO likedPosts (post_id, user_id) VALUES (?, ?)`;
                const [likedPost] = await connection.query(insertIntoLikedPosts, [postId, userId]);

                if (!likedPost) {
                    console.log('error while inserting in likedPosts');
                    return res.status(400).json("error inserting in likedPosts");
                }
                return res.status(200).json(likedPost);
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json("An error occurred while processing your request");
    }
}



   
        // add comment

       async function AddComment(req, res) {
            try {
                //   getting the comment
                const comment = req.body
                
                // verification

                const token = req.headers.authorization.split(' ')[1]
                const postId = req.params.id;

                if(!comment || comment===""){
                    console.log("no comment body")
                    return res.status(400).json("comment cannot be empty")
                }
                // decoding the token
                const decoded = jwt.decode(token, secretKey)
                if (!decoded) {
                    console.log("error decoding")
                    return res.status(400).json("couldnt find the data")
                }
                const User_Id = decoded.id;

                if (!User_Id) {
                    console.log("could not find the user id from the token");
                    return res.status(400).json('no user id found');
                }


                    const insertQuery = ` INSERT INTO comments (post_id ,comment_body,user_id) VALUES (?,?,?) ;`
                    const [result2] = await connection.query(insertQuery, [postId,req.body, User_Id]);
                    // if could not insert the data
                    if(!result2){
                        console.log("error inserting comment in new post")
                        return res.status(400).json("error insertin comments");
                    }
                    return res.status(200).json(result2);
               
                
                 
            } catch (error) {
                     console.log(error);
                     throw error;
            }
        }

        exports.data = { SendAllPosts, SendSinglePost, DeletePost, CreateAPost, upload, updateReaction,AddComment };