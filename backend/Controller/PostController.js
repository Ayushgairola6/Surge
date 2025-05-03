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

        const query = `SELECT 
    p.author,
    p.body,
    p.category,
    p.hashtags,
    p.id,
 COALESCE(p.media_urls, CAST('[]' AS JSON)) AS media_urls, 
    p.title,
    u.username,
    u.image AS user_image
FROM 
    posts p
LEFT JOIN 
    users u 
ON 
    u.id = p.author
WHERE 
    category = ?;
`
        const [Posts] = await connection.query(query, category);
        // console.log(Posts);
        if (!Posts) {
            console.log("No posts found");
            return res.status(400).json("No Post found");
        }
        return res.status(200).json(Posts)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// send posts based on ID
async function SendSinglePost(req, res) {
    try {

        const userId = req.user.id;
        const postId = req.params.id;

        if (!userId) {
            console.log("no userid")
            return res.status(400).json("user not found");
        }
        // sending the asked post with the likeCount
        const query = `SELECT 
    p.author, 
    p.body, 
    p.category, 
    p.hashtags, 
    p.id, 
    COALESCE(p.media_urls, CAST('[]' AS JSON)) AS media_urls, 
    p.title, 
    u.username, 
    u.image AS user_image, 
    (SELECT COUNT(*) FROM likedPosts lp WHERE lp.post_id = p.id) AS likeCount,
    (SELECT COUNT(*) FROM disliked_posts lp WHERE lp.post_id = p.id) AS dislikeCount,
    (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments
FROM posts p 
LEFT JOIN users u ON u.id = p.author 
WHERE p.id = ?;
`
        const [post] = await connection.query(query, [postId, postId]);
        if (!post) {
            console.log('post not found in single post')
            return res.status(400).json("post not found")
        }
        return res.status(200).send(post);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
// create post

async function CreateAPost(req, res) {

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Image not found!" })
        }
        const { category, title, caption, hashtags } = req.body;
        if (!category || !title || !caption || !hashtags) return res.status(400).json({ message: "All fields are mandatory" });
        const images = req.files;
        let imageUrls;
        // token sent by the user

        const Id = req.user.id;

        if (!Id) {
            console.log("no user found")
            return res.status(400).json("no userid in token")
        }
        // uploading media to firebase
        try {
            imageUrls = await Promise.all(images.map(img => uploadToFirebase(img, "/BlogPosts")));
            if (!imageUrls || imageUrls.length === 0) {
                return res.status(400).json({ message: "Image upload failed!" });
            }
        } catch (error) {
            console.error("Firebase upload error:", error);
            return res.status(500).json({ message: "Image upload error" });
        }
        // Insert query

        const parsedUrls = JSON.stringify(imageUrls);
        const query = `INSERT INTO posts (title,body,media_urls,category,author) VALUES ( ? , ? , ? , ? , ?)`

        const [Post] = await connection.query(query, [req.body.title, req.body.caption, parsedUrls, category, Id]);

        if (Post.affectedRows === 0) {
            return res.status(400).json({ message: "Error while creating the post! " })
        }
        return res.status(200).json({ message: "Post has been created" });

    } catch (error) {
        console.log(error);
        throw error;
    }
}


// userReaction function 


async function updateReaction(req, res) {
    try {


        const postId = req.params.id;

        const userId = req.user.id;
        if (!userId) return res.status(400).json({ message: "User id not found" });
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
        const { comment } = req.body


        const postId = req.params.id;

        if (!comment || comment === "") {
            console.log("no comment body")
            return res.status(400).json("comment cannot be empty")
        }
        const User_Id = req.user.id;

        if (!User_Id) {
            console.log("could not find the user id from the token");
            return res.status(400).json('no user id found');
        }


        const insertQuery = ` INSERT INTO comments (post_id ,comment_body,user_id) VALUES (?,?,?) ;`
        const [result2] = await connection.query(insertQuery, [postId, comment, User_Id]);
        // if could not insert the data
        if (!result2) {
            console.log("error inserting comment in new post")
            return res.status(400).json("error insertin comments");
        }
        return res.status(200).json({ message: "Comment added" });



    } catch (error) {
        console.log(error);
        throw error;
    }
}

const DeletePost = async (req, res) => {
    try {
        const post_id = req.params.id;

        if (!post_id) {
            return res.status(404).json({ message: "Post not found" });
        }

        const [Post] = await connection.query("SELECT COALESCE(p.media_urls, CAST('[]' AS JSON)) AS media_urls  FROM posts p WHERE id = ?", [post_id]);

        if (Post.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }
        // console.log(Post);

        const mediaUrls = Post[0].media_urls;

        // Delete all images from Firebase
        await Promise.all(
            mediaUrls.map(url => deleteImage(url, "/BlogPosts"))
        );

        // Delete post from DB
        const [data] = await connection.query("DELETE FROM posts WHERE id = ?", [post_id]);

        if (data.affectedRows === 0) {
            return res.status(400).json({ message: "Could not delete the post, please try again later" });
        }

        return res.json({ message: "Deleted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.data = { SendAllPosts, SendSinglePost, DeletePost, CreateAPost, upload, updateReaction, AddComment, DeletePost };