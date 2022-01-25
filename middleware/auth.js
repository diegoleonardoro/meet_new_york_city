const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');

const mongoose = require('mongoose');

//const User = require('../models/User');


String.prototype.toObjectId = function () {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};



const conn = mongoose.createConnection(process.env.MONGO_URI, {
    //options that will stop some warnings from happening:
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,

});


const User = conn.model("User", require('../models/User'));




exports.protect = asyncHandler(async (req, res, next) => {

    const emailToken = req.params.emailToken;


    if (req.headers.cookie) {
        const parseCookie = str =>
            str
                .split(';')
                .map(v => v.split('='))
                .reduce((acc, v) => {
                    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                    return acc;
                }, {});
        const cookie = parseCookie(req.headers.cookie);
        const refreshToken = cookie['refreshToken'];



        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);
        var id_ = decodedRefreshToken._id;



        req.user = await User.find({ _id: id_ });
        //console.log( ' req.headers.cookie:' , req.user)
        next();

    } else if (emailToken) {
        req.user = await User.find({ emailToken: emailToken });
        if (req.user) {
            next();
        }

    }







    // if (emailToken === req.user[0].emailToken) {
    //     console.log(emailToken);
    //    console.log(req.user[0]);
    //     next();
    //}



    //if (refreshToken) {
    //    const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN);
    //    var id_ = decodedRefreshToken._id;
    //    req.user = await User.find({ _id: id_.toObjectId() });

    //    if (emailToken === req.user[0].emailToken) {
    //        next();
    //    }
    //} else if (emailToken) {
    //    req.user = await User.find({ emailToken: emailToken });
    ///    if (req.user) {
    //        next();
    //    }
    //}





    //next();

    /*
    if (emailToken !== null) {
        const parseCookie = str =>
            str
                .split(';')
                .map(v => v.split('='))
                .reduce((acc, v) => {
                    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                    return acc;
                }, {});
        const cookie = parseCookie(req.headers.cookie);
        const token = cookie['token'];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        var id_ = decoded._id;
        req.user = await User.find({ _id: id_.toObjectId() });

        if (emailToken === req.user[0].emailToken) {
            next();
        }
    } 
     */





})


// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // console.log('4')
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`,
                403
            ));
        }
        next();
    }
}



