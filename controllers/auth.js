const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const crypto = require("crypto");




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



//@desc     Confirm user's email  
//@route    POST /auth/confirmEmailToken
//@access   Private
exports.confirmEmailToken =asyncHandler( async (req, res) => {

    try {
        const emailToken_ = req.params.emailToken;
        if (emailToken !== null) {

            // Check if the user exists:
            const user = await User.findOne({ emailToken: emailToken_ });

            // Check if email is areldy confirmed:
            if (!user.emailConfirmed) {

                // Check if provided email token matches user's email token
                if (emailToken === user.emailToken) {
                    await User.updateOne({ email: decodedAccessToken.email }, { $set: { emailConfirmed: true, emailToken: null } })
                    res.status(200).json({ success: { status: 200, message: 'EMAIL_CONFIRMED' } });
                } else {
                    res.status(401).json({ error: { status: 401, message: "INVALID_EMAIL_TOKEN" } });
                }
            } else {
                res.status(401).json({ error: { status: 401, message: "EMAIL_ALREADY_CONFIRMED" } });
            }

        } else {
            res.status(400).json({ error: { status: 400, message: "BAD_REQUEST" } })
        }
    } catch (error) {
        res.status(400).json({ error: { status: 400, message: 'BAD_REQUEST' } });
    }

    
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


