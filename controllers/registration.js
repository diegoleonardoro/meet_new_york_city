const ErrorResponse = require("../utils/errorResponse");
const UserRegistration = require("../models/User");// <<------ registration schema.
const asyncHandler = require("../middleware/async");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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


    const emailToken = uuidv4();

    const accessToken = jwt.sign({// ----------------------------------------------------------> create access token
        _id: user.id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    const refreshToken = jwt.sign({// --------------------------------------------------------> create refresh token
        _id: user.id,
        email: user.email
    }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: process.env.REFRESH_JWT_EXPIRE });




    await User.updateOne({ email: user.email }, {// ------------------------------------------> update the created user with the 'refreshToken' 
        $set: {
            'emailToken': emailToken
        },
        $push: {
            'security.tokens': {
                refreshToken: refreshToken,
                createdAt: new Date()
            },
        },
    });





    await sendEmailConfirmation({ email: user.email, emailToken: user.emailToken });




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



const sendEmailConfirmation = async (user) => {

    console.log(user.email);

    const transport = nodemailer.createTransport({
        //host: process.env.NODEMAILER_HOST,
        //port: process.env.NODEMAILER_PORT,
        service: 'smtp-mail.outlook.com',
        secureConnection: false,
        port: 587, 
        auth: {
            user: process.env.NODE_MAILER_GMAIL_USER,//process.env.NODEMAILER_USER,
            pass: process.env.NODE_MAILER_GMAIL_PASSWORD //process.env.NODEMAILER_PASSWORD
        }
    });

    const info = await transport.sendMail({
        from: ' Diego ',
        to: user.email,
        subject: 'Confirm your email',
        text: `Click the link to confirm your email https://meet-nyc.herokuapp.com//confirm-email/${user.emailToken}`,
    })

}
