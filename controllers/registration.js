const ErrorResponse = require("../utils/errorResponse");
const UserRegistration = require("../models/User");// <<------ registration schema.
const asyncHandler = require("../middleware/async");

const mongoose = require('mongoose');
//const connectDB = require("../config/db");
//const conn = connectDB();
//const User = conn.model("User", require('../models/User'));



const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});
const User = conn.model("User", require('../models/User'));



//init gfs
//let gfs;
//conn.once("open", () => {
//   gfs = Grid(conn.db, mongoose.mongo);
//    gfs.collection('uploads');
//});




//@desc     renders the registration templave
//@route    GET /register
//@access   public
exports.Registration_Interface = (req, res, next) => {
    res.render("registration")
    res.end();
}


//@desc     renders the registration templave
//@route    POST /register
//@access   public
exports.register_User = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    console.log('hoaholaholahoolahola jijiijijijij')
    sendTokenResponse(user, 200, res);
})


//@desc     Login user 
//@route    GET /register/login
//@access   Public
exports.login_interface = (req, res, next) => {
    res.render('login')
    res.end();

}



//@desc     Login user 
//@route    POST /register/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and passwrod', 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    };

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    };

    sendTokenResponse(user, 200, res);

})





const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // ---> This represents 30 days (time beyond which the token will expire)
        httpOnly: true
    };

    var flag = user.formResponded;

    console.log(token);
    console.log(options);

    if (flag) {
        res
            .status(statusCode)
            .cookie('token', token, options)
            .json({
                success: true,
                token,
                flag
            })
    } else {
        res
            .status(statusCode)
            .cookie('token', token, options)
            .json({
                success: true,
                token
            })

    }

   
    return token;
}

