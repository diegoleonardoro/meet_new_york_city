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





// Protect routes
exports.protect = asyncHandler(async (req, res, next) => { // ----> to use this method, we need to add it the route that we want to protect as a first parameter  

    const token = req.headers.cookie.split('token=')[1];
    if (token) {

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            var id_ = decoded.id;

            req.user = await User.find({ _id: id_.toObjectId() });

            if (req.user) {

                await User.updateOne({ _id: id_.toObjectId() }, { $set: { emailConfirmed: true, emailToken: null } });

                next();
            }

        } catch (err) {
            return next(new ErrorResponse('Not authorized to access this route', 401));
        }
    } else {
        return next(new ErrorResponse('ACCESS DENIED', 400));
    }



    //if (
    //    req.headers.authorization &&// ---> Here we are cheking if there is an authorization header 
    //    req.headers.authorization.startsWith('Bearer') // ---> in the headers, the token is sent with the "authorization" key and it starts with the word "Bearer"
    //) {
    //    // Set token from a Bearer token in header
    //    token = req.headers.authorization.split(' ')[1];
    //    console.log(token)
    //}
    //====================================================================================
    //===================================================================================

    // Set token from a cookie
    // else if (req.cookies.token) { // This else if allows us to send the token as a cookie 
    //    console.log("lolissss"); 
    //   token = req.cookies.token;
    //} 
    //====================================================================================

    /*
    GETTING THE USER USING THE EMAIL TOKEN.
    try {
        const emailToken = req.params.emailToken;
    
        req.user = await User.find({ emailToken: emailToken });
        
        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    */





})


// Grant access to specific roles
exports.authorize = (...roles) => { // The roles that are passed to this function in the routes file are the only ones that will be able to access that route. The "role" sent by the client be included in this "roles" array if he/she wants to access that route. 
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            // console.log('4')
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`,
                403
            ));
        }
        //console.log('4')
        next();
    }
}



