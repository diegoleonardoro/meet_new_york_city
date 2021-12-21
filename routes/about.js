const express = require("express");


const {
    aboutPlage
} = require("../controllers/about");



const router = express.Router();

//base route: about
router.route('/')
    .get(aboutPlage)


module.exports = router;