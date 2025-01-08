const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");
const env = require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.firebaseapiKey,
  authDomain: process.env.firebaseauthDomain,
  projectId: process.env.firebaseprojectId,
  storageBucket: process.env.firebasestorageBucket,
  messagingSenderId: process.env.firebasemessagingSenderId,
  appId: process.env.firebaseappId,
  measurementId: process.env.firebasemeasurementId,
};

const app = initializeApp(firebaseConfig)

const storage = getStorage(app);

module.exports =   {storage};