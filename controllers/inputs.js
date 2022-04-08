
const asyncHandler = require("../middleware/async");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});
const User = conn.model("User", require('../models/User'));
const Inputs = conn.model("Inputs", require('../models/User_input'));// <<<<--------------------------------------------------------



String.prototype.toObjectId = function () {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};



// @desc    Gets all inputs 
// @route   GET /inputs/allInputs
// @access  Public
exports.getAllInputs = asyncHandler(async (req, res, next) => {

    const inputs = await Inputs.find({}, 'location image placeDescription'); // <<<<--------------------------------------------------------

    let inputsFiltered = []
    for (var i = 0; i < inputs.length; i++) {
        let image = inputs[i].image.data.buffer
        let imageDataBuffer = Buffer.from(image, "base64");
        var placeDescrpn = inputs[i].placeDescription;
        let flag = 28;
        let placeDescrpnSpaced = '';
        let placeDescrpRaw = '';
        let placeDescrForArray = ''
        let placeDescrArray = [];
        for (let i = 0; i < placeDescrpn.length; i++) {
            placeDescrpRaw = placeDescrpRaw + placeDescrpn[i];
            placeDescrpnSpaced = placeDescrpnSpaced + placeDescrpn[i];
            placeDescrForArray = placeDescrForArray + placeDescrpn[i];

            if (placeDescrpRaw.length >= flag && placeDescrpnSpaced.charAt(placeDescrpnSpaced.length - 1) === ' ') {
                placeDescrArray.push(placeDescrForArray)
                placeDescrpnSpaced = placeDescrpnSpaced + '<br>';
                flag = flag + 32;
                placeDescrForArray = '';
            }
        }
        inputsFiltered.push({
            'location': inputs[i].location,
            'imageSrc': "data:image/png;base64," + imageDataBuffer.toString("base64"),
            'placeDescription': placeDescrArray
        })
    }
    res.render("all_inputs", { inputsFiltered });
})




//@desc     Post a single input 
//@route    POST /inputs/userId
//@access   Private
exports.createInput = asyncHandler(async (req, res, next) => {

    //console.log(req.files);
    //console.log('=============================');


    req.body.neighborhoodSatisfaction = JSON.parse(req.body.neighborhoodSatisfaction);
    req.body.neighborhoodFactorDescription = JSON.parse(req.body.neighborhoodFactorDescription);
    req.body.favoritePlaces = JSON.parse(req.body.favoritePlaces);



    var favoritePlaces = req.body.favoritePlaces;


    let h = 0;
    let z;


    for (let i = 0; i < favoritePlaces.length; i++) {// 1. iterate through all the favorite places 

        let photoArray = [];

        let numOfPhotos = favoritePlaces[i]['numberOfPhotos'];// 2. access the amount of photos per place


        for (var u = 0; u < numOfPhotos; u++) {

            let file = req.files[0];
            photoArray.push(file);

            req.files.splice(0, 1)
        }

        favoritePlaces[i]['placeImage'] = photoArray;
    }


    req.body.favoritePlaces = favoritePlaces;
    req.body.user = req.user.id;

    const input = await Inputs.create(req.body); // <<<<--------------------------------------------------------

    console.log(req.body);

    var inputData = Object.assign(req.body, { formResponded: '1' });

    const user = await User.findByIdAndUpdate({ _id: req.user.id.toObjectId() }, inputData)//.populate('input');

    const accessToken = jwt.sign({
        _id: user.id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });

    res
        .status(200)
        //.cookie('token', accessToken, { httpOnly: true })
        .json({
            success: true,
        })



    //sendTokenResponse(user, 200, res);//  I THINK IN THIS ROUTE I DO NOT NEED TO SEND A TOKEN.




})



const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // ---> This represents 30 days (time beyond which the token will expire)
        httpOnly: true // This lets us make the cookie available only to the client side script
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })

    return token;
}