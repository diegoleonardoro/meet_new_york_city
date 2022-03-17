const ErrorResponse = require("../utils/errorResponse");
const UserRegistration = require("../models/User");// <<------ registration schema.
const asyncHandler = require("../middleware/async");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2



//const Grid = require("gridfs-stream");
//const connectDB = require("../config/db");
//const conn = connectDB();
//const User = conn.model("User", require('../models/User'));



const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});



// Initialize GrigFs to retreive images from database
/*
let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});
 */
// ========= ========= ========= ========= =========


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



    if (req.file) {
        req.body.profileImage = req.file;
    }


    const user = await User.create(req.body);

    const emailToken = uuidv4();

    const accessToken = jwt.sign({
        _id: user.id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });


    const refreshToken = jwt.sign({
        _id: user.id,
        email: user.email
    }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: process.env.REFRESH_JWT_EXPIRE });





    await User.updateOne({ email: user.email }, {
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

    //await 
    sendEmailConfirmation({ email: user.email, emailToken: emailToken });



    //Create the function to access the profile image:
    /*
    const profileImgFormatted = [];
    function createStream() {
        let readstream = gfs.createReadStream(user[0].profileImage.filename);
        let fileChunks = [];
        readstream.on('data', function (chunk) {
            fileChunks.push(chunk);
        });
        readstream.on('end', function () {
            let concatFile = Buffer.concat(fileChunks);
            imageFormated = Buffer(concatFile).toString("base64");
            profileImgFormatted.push(imageFormated);
        });
    }
    createStream();
    */
    // ====== ====== ====== ====== ====== ====== ======



    // send the response data to the user

    res
        .status(200)
        .cookie('token', accessToken, { httpOnly: true, secure: true })// token, options
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .json({
            success: true,
        })




    /*
    const responseData = user;
    setTimeout(() => {
        res.render("questionnaire", { user: responseData, profileImage: profileImgFormatted });
    }, 2000);
    */
    // ====== ====== ====== ====== ====== 


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

    // create the refresh token:
    const refreshToken = jwt.sign({// --------------------------------------------------------> create refresh token
        _id: user.id,
        email: user.email
    }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: process.env.REFRESH_JWT_EXPIRE });


    sendTokenResponse(user, 200, res, refreshToken);

});







const sendTokenResponse = (user, statusCode, res, accessToken, refreshToken) => {

    //const token = user.getSignedJwtToken();// getSignedJwtToken() is a User schema method which creates a token based on the user _id
    const options = {
        expiresIn: process.env.JWT_COOKIE_EXPIRE,
        httpOnly: true
    };

    var flag = user.formResponded;

    if (flag) {
        res

            .status(statusCode)
            .cookie('token', accessToken)
            .cookie('refreshToken', refreshToken)


            .json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
            })


    } else {
        res
            .status(statusCode)
            .cookie('token', accessToken)// token, options
            .cookie('refreshToken', refreshToken)

            .json({
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
            })

    }

}




const myOAuth2Client = new OAuth2(
    "740814692567-aj9v93eh19s502kv89e3qcj7mtd82i2d.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
)


myOAuth2Client.setCredentials({
    refresh_token: "1//04gmlT4LGtnsVCgYIARAAGAQSNwF-L9Irtm3oN8HJwxsJvaFbUIEXKxmd4k3ErgW-boaHlAHq6cI66HpOsgelTdJEiB_kOJW7mv8"
});


const myAccessToken = myOAuth2Client.getAccessToken();












const sendEmailConfirmation = async (user) => {


    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.NODE_MAILER_GMAIL_USER, //your gmail account you used to set the project up in google cloud console"
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: myAccessToken //access token variable we defined earlier
        }
    });


    const mailOptions = {
        from: 'diego@meetnewyork.city', // sender
        to: user.email, // receiver
        subject: 'Welcome to Meet New York City', // Subject
        html: '<p> Click here to confirm your address:  </p>'// html body
    }




    transport.sendMail(mailOptions)






    // const transport = nodemailer.createTransport({
    //     service: 'gmail',
    //     // host: "smtp.gmail.com",
    //     port: 2525,
    //     secure: false,
    //     auth: {
    //         user: process.env.NODE_MAILER_GMAIL_USER,
    //         pass: process.env.NODE_MAILER_GMAIL_PASSWORD
    //     }
    // });

    // //await
    // transport.sendMail({
    //     from: ' Diego ',
    //     to: user.email,
    //     subject: 'Confirm your email',
    //     text: `Click the link to confirm your email http://meet-nyc.herokuapp.com/users/${user.emailToken}`,
    //     //meet-nyc.herokuapp.com
    // })


}
