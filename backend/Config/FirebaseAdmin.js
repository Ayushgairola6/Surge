const admin = require('firebase-admin');
const crypto = require("crypto");
 require("dotenv").config();
 const serviceAccountjson = Buffer.from(process.env.SERVICE_ACCOUNT_KEY,'base64').toString('utf-8')
const serviceAccount = JSON.parse(serviceAccountjson);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "lemon-1ef21.appspot.com"
})


const bucket = admin.storage().bucket();


const uploadToFirebase = async (file, path) => {
    try {
        const truncatedFileName = file.originalname.substring(0,10);
        const fileName = `${path}/${Date.now()}_${truncatedFileName}`;
        const storageRef = bucket.file(fileName);

        const stream = storageRef.createWriteStream({
            metadata: { contentType: file.mimetype },
        });

        await new Promise((resolve, reject) => {
            stream.on('error', reject);
            stream.on('finish', resolve);
            stream.end(file.buffer);
        });
        await storageRef.makePublic();
        // const downloadUrl = await storageRef.getSignedUrl({
        //     action: 'read',
        //     expires: Date.now() + 7 *24 * 60 *60 *1000 // store for a week 
        // });
        const downloadUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        // console.log('File uploaded:', downloadUrl);
        // return downloadUrl[0];
        return downloadUrl;
    } catch (error) {
        console.error('Error uploading file to Firebase:', error);
        throw error;
    }
};

// function to delete media from firebase when a post is deleted 

const deleteImage = async (fileUrl,filePath) => {
    try {
        if (fileUrl) {
            const bucketName = "lemon-1ef21.appspot.com";  
            // extracting the bucketName and its length from the fileUrl;
            const startIndex = fileUrl.indexOf(`${bucketName}/`) + `${bucketName}/`.length;
            const filePathEncoded = fileUrl.slice(startIndex, fileUrl.indexOf("?"));
            const filePath = decodeURIComponent(filePathEncoded);  
         
            const storageRef = bucket.file(filePath);
            await storageRef.delete();
            console.log("post has been deleted")
            
        }
    } catch (error) {
        console.error('Error deleting file from Firebase:', error);
        throw error;
    }
};




module.exports = { admin, bucket, uploadToFirebase, deleteImage };