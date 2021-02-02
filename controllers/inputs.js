const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const Inputs = require("../models/User_input");
const asyncHandler = require("../middleware/async");
const geoCoder = require("../utils/geoCoder");


//@desc     Gets the input interface
//@route    GET /
//@access   Public
exports.getInterface = (req, res, next) => {

    res.render("index.html") //<== here, we are rendering "index.html" every time we get a "get" request for the base route. 
    res.status(200).json({ success: true });
    res.end();

}



//@desc     Gets all inputs 
//@route    GET /inputs
//@access   Public
exports.getInputs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults); // We are able to access advancedResults because we are using this middleware in the GET route. The "advancedResults" returns an object with all the information that we want to send to the client. 
})






// @desc    Gets one single input
// @route   GET /inputs/:id 
// @access  Public
exports.getInput = asyncHandler(async (req, res, next) => {
    //try {
    const input = await Inputs.findById(req.params.id);
    if (!input) {
        return next(
            new ErrorResponse(`Record with id ${req.params.id} not founde`, 404)
        )
    }
    res.status(200).json({ sucess: true, data: input })
    //} catch (err) {
    //    next(err);
    //}
})

//@desc     Post a single input 
//@route    POST /inputs
//@access   Private
exports.createInput = asyncHandler(async (req, res, next) => {

    // Add user to req.body
    req.body.user = req.user.id; // In the "protect" middleware, we created "req.user" and gave it the values of the User that was in the data base and which is trying to access this route. 
    //  "user" is a field in our "Inputs" schema which we will use to start creating relations between user and created Inputs

    // Check for any Input published by the user that is trying to access this route
    const publishedInput = await Inputs.findOne({ user: req.user.id });

    // If the user is not an adming, they can only publish one Input
    if (publishedInput && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `The user with id ${req.user.id} has already published a bootcamp`,
                400
            )
        )
    }

    const input = await Inputs.create(req.body);
    res.status(201).json({
        success: true,
        data: input
    })

})



// @desc     Update input
// @route    PUT /inputs/:id 
// @access   Private
exports.updateInput = asyncHandler(async (req, res, next) => {

    //try {
    let input = await Inputs.findById(req.params.id);

    if (!input) {
        return next(
            new ErrorResponse(`Record with id ${req.params.id} not founde`, 404)
        )
    }

    // Make sure user is Input owner
    if (input.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this bootcamp`,
                401
            )
        );
    };

    input = await Inputs.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })


    res.status(200).json({ sucess: true, data: input });


})


// @desc    Delete input
// @rouse   DELETE  /inputs/:id
// @access  Private 
exports.deleteInput = asyncHandler(async (req, res, next) => {
    // Inside the Inputs schema, there is a pre "remmove" middleware which deletes records from the realEstateVars model that fulfill: { input: this._id }
    const input = await Inputs.findById(req.params.id); // change "findByIdAndDelete" to "findById" so that the middleware present in models -> User_input.js, and which deletes real estate vars when a place in deleted, works 

    if (!input) {
        return next(
            new ErrorResponse(`Record with id ${req.params.id} not founde`, 404)
        )
    }

    // Make sure user is Input owner
    if (input.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to delete this bootcamp`,
                401
            )
        );
    };



    input.remove();
    res.status(200).json({ sucess: true, data: {} });


})



// @desc    Get inputs withing a radious 
// @rouse   GET  /inputs/radious/:zipcode/:distance
// @access  Private 
exports.getInputsInRadious = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params; // we get these two values from the url sent by the client 

    // Get lat and lon from geocoder 
    const loc = await geoCoder.geocode(zipcode); // geoCoder lets us do reverse geo coding: from addresses to coordinates 
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radious using radians
    // Divide dist by radius of Earth 
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963; // distance is the distance in miles whithing which the the client wants to see the places. 

    const inputs = await Inputs.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } // $centerSphere Defines a circle for a geospatial query that uses spherical geometry. The query returns documents that are within the bounds of the circle. You can use the $centerSphere operator on both GeoJSON objects and legacy coordinate pairs.
    })

    res.status(200).json({
        success: true,
        count: inputs.length,
        data: inputs
    })
})




// @desc    Upload photo for place
// @rouse   PUT  /inputs/:id/photo
// @access  Private 
exports.placePhotoUpload = asyncHandler(async (req, res, next) => {
    const input = await Inputs.findById(req.params.id);
    if (!input) {
        return next(
            new ErrorResponse(`Record with id ${req.params.id} not found`, 404)
        )
    }



     // Make sure user is Input owner
    if (input.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(
            new ErrorResponse(
                `User ${req.params.id} is not authorized to update this bootcamp`,
                401
            )
        );
    };




    if (!req.files) {
        return next(
            new ErrorResponse(`Please upload a file`, 400)
        )
    }

    const file = req.files.file;

    // Make sure the the file is photo 
    if (!file.mimetype.startsWith('image')) { //all image files will start with "image" in their mimetype section  
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
            400
        ));
    }


    // Create custom file name 
    file.name = `photo_${input._id}${path.parse(file.name).ext}` // In this method we are uploading a photo to an existing input record, because it already exists, we can access its "_id" field and use it to create the file name. 

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {

        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Inputs.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })

    }) // .mv is a function in the file that help us save the image in a folder. The first argument that it takes in the path where we want to save the file. 

})


