const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
//const Inputs = require("../models/User_input");
const asyncHandler = require("../middleware/async");
const geoCoder = require("../utils/geoCoder");
const fs = require('fs');
//const User = require("../models/User");
const mongoose = require('mongoose');



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


    req.body.neighborhoodSatisfaction = JSON.parse(req.body.neighborhoodSatisfaction);
    req.body.neighborhoodFactorDescription = JSON.parse(req.body.neighborhoodFactorDescription);
    req.body.favoritePlaces = JSON.parse(req.body.favoritePlaces);



    var favoritePlaces = req.body.favoritePlaces;


    /* 
    for (var i = 0; i < favoritePlaces.length; i++) {
        let photoArray = []
        let numOfPhotos = favoritePlaces[i].numberOfPhotos;
        for (var h = 0; h < numOfPhotos; h++) {
            photoArray.push({

                data: fs.readFileSync('/Users/diegoleoro/meet_nyc/uploads/' + req.files[h].filename),
                contentType: 'image/png'

            })
        }
        favoritePlaces[i]['placeImage'] = photoArray;
        // console.log(photoArray);
    };
    */




    //let photosFlag = 0;

    let h = 0;
    let z;
    for (let i = 0; i < favoritePlaces.length; i++) {

        let photoArray = []
        let numOfPhotos = favoritePlaces[i]['numberOfPhotos'];

        if (i===0){
            z = numOfPhotos;
        }else{
            z = h + numOfPhotos;
        }

        for (h; h < z; h++) {

            //photosFlag = photosFlag + h;
            let file = req.files[h];
            //console.log(file);
            photoArray.push(file);

        }

        h = numOfPhotos;

        favoritePlaces[i]['placeImage'] = photoArray;

    

        //console.log('tftf: ', favoritePlaces[i]['placeImage'])

    }


     //console.log(favoritePlaces);


    req.body.favoritePlaces = favoritePlaces;
    req.body.user = req.user.id;


    // here, instead of creating an input, I would have to update the User with what he responded on the main form 
    const input = await Inputs.create(req.body); // <<<<--------------------------------------------------------

    //console.log(req.body);

    var inputData = Object.assign(req.body, { formResponded: '1' });

    //console.log('image: ', inputData.favoritePlaces);

    const user = await User.findByIdAndUpdate({ _id: req.user[0].id.toObjectId() }, inputData)//.populate('input');



    sendTokenResponse(user, 200, res);

})




// @desc    Get inputs withing a radious 
// @rouse   GET  /inputs/radious/:zipcode/:distance
// @access  Private 
exports.getInputsInRadious = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat and lon from geocoder 
    const loc = await geoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radious using radians
    // Divide dist by radius of Earth 
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const inputs = await Inputs.find({ // <<<<--------------------------------------------------------
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })
    res.status(200).json({
        success: true,
        count: inputs.length,
        data: inputs
    })
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