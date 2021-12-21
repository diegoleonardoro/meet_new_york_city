const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require('path');


//@desc     Login user 
//@route    GET /register/login
//@access   Public

exports.aboutPlage = asyncHandler(async (req, res, next) => {


    res.sendFile(path.join(__dirname, '../public', 'about.html'))



});
