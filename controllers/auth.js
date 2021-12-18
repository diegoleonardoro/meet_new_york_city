const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const crypto = require("crypto");


//@desc     Register user
//@route    POST /auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    //Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    sendTokenResponse(user, 200, res);
})


//@desc     Login user 
//@route    POST /auth/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
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


//@desc     Log user out / clear cookie 
//@route    GET /auth/logout 
//@access   Private
exports.logout = asyncHandler(async (req, res, next) => {

    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })

})



//@desc     Get current logged in user  
//@route    POST /auth/me
//@access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
})



//@desc     Update user details  
//@route    PUT /auth/updatedetails
//@access   Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })

})



//@desc     Update password   
//@route    POST /auth/updatepassword
//@access   Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }
    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);

})



//@desc     Forgot password  
//@route    POST /auth/forgotpassword
//@access   Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404));
    }
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has 
    requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });
        res.status(200).json({ sucess: true, data: 'Email sent' });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be send ', 500));
    }
})





//@desc     Reset password  
//@route    PUT /auth/resetpassword/:resettoken
//@access   Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

    const resetPasswordToken = crypto.
        createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse('Inalid token', 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);

})



















// ......-------......-------......-------......-------......-------......-------......-------......-------......-------
// -----........-----........-----........-----........-----........-----........-----........-----........-----........
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => { // user is a representation of the user schema.
    // Create token
    const token = user.getSignedJwtToken(); // getSignedJwtToken() is a funciton in the User schema that creates the token. 
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // ---> This represents 30 days
        httpOnly: true // This lets us make the cookie available only to the client side script
    };

    /*
    we can set the secure cookies option to true if the environment is set to 'production':
    // --- .... --- .... --- .... --- 
    if(process.env.NODE_ENV==='production'){
        options.secure = true;
    }
    // --- .... --- .... --- .... ---
    */
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}
// ......-------......-------......-------......-------......-------......-------......-------......-------......-------
// -----........-----........-----........-----........-----........-----........-----........-----........-----........
// ......-------......-------......-------......-------......-------......-------......-------......-------......-------


