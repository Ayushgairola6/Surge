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
                console.log('user found')
                const user = result[0];

                // Compare the password
                const isValid = await bcrypt.compare(password, user.password_hash);
                if (!isValid) {
                    console.log("password did not match")
                    return res.status(400).json({ message: "Password did not match" });
                }

                // Generate JWT token
                const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "2h" });

                return res.status(200).json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user.id,
                        name: user.username,
                        email: user.email,
                    },
                });
            } catch (error) {
                console.error("Error in Login:", error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }


        // get a user ;

      async  function getUser(req, res) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                if (!token) {
                    console.log("no jwttoken found")
                    return res.status(400).send({ message: "check if user even exists" })
                }
                
              const decoded = jwt.decode(token,secret);
              if(!decoded){
                console.log('jwt verify/decoded error');
                return res.status(400).json('no decoded token');
              }
               const userId = decoded.id;

               if(!userId){
                console.log("userID not found")
                return res.status(400).json("no user found")
               }

           
              const UserQuery = `SELECT * FROM users WHERE users.id = ?`
              const [User] = await UserTable.query(UserQuery,userId)
        
               if(!User){
                console.log("user not found in database");
                return res.status(400).json("This account not found in our database");
               }

               const postQuery =` SELECT * FROM posts WHERE author = ?`
               const [posts] = await UserTable.query(postQuery,userId)
           
              if(!posts){
                console.log("no user posts")
                return res.status(400).json("error finding user posts")
              }

                   return res.status(201).json({User,posts})

            } catch (error) {
                console.log(error);
                throw error;
            }
        }

// Update user profile by adding profile picture
       async function Upload_profileImage(req,res) {
         
         try{
            const token = req.headers.authorization.split(" ")[1];         
              if(!token ){
                console.log("no token found")
                return res.status(400).json("no token found");
              }
            const decoded = jwt.decode(token ,secret);
            const id = decoded.id;

            if(!id){
                console.log("error getting userid from token");
                return res.status(400).json("some error with extracting user id")
            }
       
         let imageUrl ;
         if(!req.file || req.file === "" ){
          console.log("no image or empty image")
            return res.status(400).json("no image found")
         }
         // if image is not uploaded
          imageUrl  = await uploadToFirebase(req.file,"ProfilePictures")

         if(!imageUrl){
            console.log("imageUrl error while inserting into cloud");
            return res.status(400).json("no image URL")
         }
  
          // Inserting the image in the Database/table
          const inseryQuery = ` UPDATE users SET image = ? WHERE id = ?`
          const [data] = await UserTable.query(inseryQuery,[imageUrl,id])

         // get the userdata from usertable and user related data from the posts table
           const query = `SELECT * FROM users WHERE users.id = ?`;
           const [user] = await UserTable.query(query,id);
 

            if(!user){
                console.log("no user found");
                return res.status(400).json("no user found");
            }

           const query2 = ` SELECT * FROM posts WHERE author = ?`;
           const [posts] = await UserTable.query(query2,id);

          if(!posts){
                console.log("no posts found");
                return res.status(400).json("no user found");
            }
            console.log({user,posts})
 
         return res.status(200).json({user,posts});
         }
         catch(error){
            console.log(error)
            throw error;
         }
        }


// Send profiles

const sendProfile = async(req,res)=>{
try{
    // the users id we want the profile sent via parameters
  console.log("envoked")

          const Id = req.params.id;
          const token = req.headers.authorization.split(' ')[1];

          if(!req.params.id){
            return res.status(400).json({message:"No user Id found"});
          }
                if (!token ) {
                    console.log("no jwt token found")
                    return res.status(400).send({ message: "check if user even exists" })
                }
          
              const UserQuery = `SELECT * FROM users WHERE users.id = ?`
              const [User] = await UserTable.query(UserQuery,Id)
         console.log(User)
               if(!User){
                console.log("user not found in database");
                return res.status(400).json("This account not found in our database");
               }

               const postQuery =` SELECT * FROM posts WHERE author = ?`
               const [posts] = await UserTable.query(postQuery,Id)
           
              if(!posts){
                console.log("no user posts")
                return res.status(400).json("error finding user posts")
              }

            console.log({user,posts})
console.log("ended")
                   return res.status(200).json({User,posts})


}catch(err){
    console.log(err);
    throw err;
}
} 



        exports.data = { getUser, Login, Signup ,Upload_profileImage,upload,sendProfile}