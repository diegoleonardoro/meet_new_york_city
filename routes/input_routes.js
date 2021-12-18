
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");

const path = require("path");
const methodOverride = require('method-override');

const connectDB = require("../config/db");

const {
    createInput,
    getInputsInRadious,
    getAllInputs
} = require("../controllers/inputs.js")



//init gfs
//let gfs;
////gfs = new mongoose.mongo.GridFSBucket(connectDB(), {
//   bucketName: "../uploads"
//});

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
                resolve(fileInfo);

            });

        });
    }
});





// Base route: '/inputs'
// Multer:
/* 
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
*/


const uploadFile = multer({
    storage
});



// Inputs schema:
const Inputs = require("../models/User_input");

const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

// Import the middlewares that protect routes
const { protect, authorize } = require("../middleware/auth")

// Routes and their controllers:
router
    .route("/radius/:zipcode/:distance")
    .get(getInputsInRadious);

router
    .route('/userId')
    .post(protect, uploadFile.array('placeImage'), createInput);

router
    .route('/allInputs/showall')
    .get(getAllInputs)


module.exports = router;