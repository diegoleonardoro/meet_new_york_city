
const express = require("express");
const multer = require("multer");


const {
    createInput,
    getInputsInRadious,
    getAllInputs
} = require("../controllers/inputs.js")


// Base route: '/inputs'

// Multer:
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadFile = multer({
    storage: storage,
})

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