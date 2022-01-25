const express = require('express');

const multer = require("multer");
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");

const path = require("path");

const {
    Registration_Interface,
    register_User,
    login_interface,
    login
} = require('../controllers/registration')

// MongoDB GridFs storage:
const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {

            crypto.randomBytes(16, (err, buf) => {

                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);//
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                
                console.log(fileInfo)

                resolve(fileInfo);

            });

        });
    }
});

const uploadFile = multer({
    storage
});

// Base route:  '/register'
const router = express.Router();

router
    .route("/")
    .get(Registration_Interface)
    .post(uploadFile.single('profileImage'), register_User)


router
    .route("/login")
    .get(login_interface) // render the registration template.
    .post(login)// post the regustration variables.


module.exports = router;