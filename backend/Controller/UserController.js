const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const connection = require("../Model/db");
const { user } = require("../Model/User");
const UserTable = connection.data.PromiseConnection;
const secret = process.env.JWT_SECRET_KEY;
const multer = require("multer");

const { uploadToFirebase } = require('../Config/FirebaseAdmin.js')

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 5 } })



// function to verifytoken and keep the user logged in
const UpdateState = async (req, res) => {
    
    try {
        if (req.user) {
            return res.status(200).json({ message: "Authorized" })
        } else {
            return res.status(200).json({ message: "Verified" });
        }
    } catch (error) {
        throw new Error("You are not authorized")
    }
}


// creating an account
async function Signup(req, res) {
    try {
        console.log("called");
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            console.log("something wrong with input")
            return res.status(400).json({ message: "Fields can't be empty" });
        }

        // Check if the user already exists
        const [existingUser] = await UserTable.query("SELECT * FROM users WHERE email = ?;", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Insert the user into the database
        const [result] = await UserTable.query(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?);",
            [username, email, hashedPassword]
        );

        // Return success response
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: result.insertId,
                username,
                email,
            },
        });
    } catch (error) {
        console.error("Error in Signup:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// Login function
async function Login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("some error with the input")
            return res.status(400).json({ message: "Fields can't be empty" });
        }

        // Check if the user exists
        const [result] = await UserTable.query("SELECT * FROM users WHERE email = ?;", [email]);
        if (result.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        const user = result[0];
        // Compare the password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            console.log("password did not match")
            return res.status(400).json({ message: "Password did not match" });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "2h" });
        res.cookie("auth_token", token, {
            httpOnly: false,
            secure: false,
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful", token: token
        });
    } catch (error) {
        console.error("Error in Login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


// get a user ;

async function getUser(req, res) {
    try {
        const userId = req.user.id;

        if (!userId) {
            console.log("userID not found")
            return res.status(400).json("no user found")
        }


        const query = `SELECT * FROM users WHERE id = ?`;

        const [User] = await UserTable.query(query, userId);

        if (User.length === 0) {
            return res.status(400).json({ message: "User not found" })
        }
        const Find = `SELECT * FROM posts WHERE author = ?`
        const [posts] = await UserTable.query(Find, userId)


        return res.status(201).json({ User, posts })

    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Update user profile by adding profile picture
async function Upload_profileImage(req, res) {

    try {
        const id = req.user.id;
        if (!id) {
            console.log("error getting userid from token");
            return res.status(400).json("some error with extracting user id")
        }

        let imageUrl;
        if (!req.file || req.file === "") {
            console.log("no image or empty image")
            return res.status(400).json("no image found")
        }
        // if image is not uploaded
        imageUrl = await uploadToFirebase(req.file, "ProfilePictures")

        if (!imageUrl) {
            console.log("imageUrl error while inserting into cloud");
            return res.status(400).json("no image URL")
        }

        // Inserting the image in the Database/table
        const inseryQuery = ` UPDATE users SET image = ? WHERE id = ?`
        const [data] = await UserTable.query(inseryQuery, [imageUrl, id])

        if (!data) {
            return res.status(400).json({ message: "Error please try again" });
        }
        
        return res.status(200).json({ message: "Updated successfully" });
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}


// Send profiles

const sendProfile = async (req, res) => {
    try {
        // the users id we want the profile sent via parameters

        const Id = req.params.id;
         console.log(Id);
        if (!req.params.id) {
            return res.status(400).json({ message: "No user Id found" });
        }

        const UserQuery = `SELECT * FROM users WHERE users.id = ?`
        const [User] = await UserTable.query(UserQuery, Id)
        if (!User) {
            console.log("user not found in database");
            return res.status(400).json("This account not found in our database");
        }
        console.log(User);
        const postQuery = ` SELECT * FROM posts WHERE author = ?`
        const [posts] = await UserTable.query(postQuery, Id)

        if (!posts) {
            console.log("no user posts")
            return res.status(400).json("error finding user posts")
        }

        return res.status(200).json({ User, posts })


    } catch (err) {
        console.log(err);
        throw err;
    }
}



exports.data = { getUser, Login, Signup, Upload_profileImage, upload, sendProfile, UpdateState }