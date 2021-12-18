const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const Grid = require("gridfs-stream");

const mongoose = require('mongoose');


//const User = require("../models/User");
//const Inputs = require("../models/User_input");





const conn = mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});


let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const User = conn.model("User", require('../models/User'));
const Inputs = conn.model("Inputs", require('../models/User_input'));







const path = require('path');

//@desc     Get all users
//@route    GET /auth/users
//@access   Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


//@desc     Get single user 
//@route    GET /auth/users/:id
//@access   Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: user
    })

});




//@desc     Get users assosiated to a neighborhood
//@route    GET /users/neighborhood/:neighborhood
//@access   Public
exports.getNeighborhood = asyncHandler(async (req, res, next) => {

    var neighborhood = req.params.neighborhood;
    var input = await Inputs.find({ 'neighborhood': neighborhood }).populate({  // <<<<--------------------------------------------------------
        path: 'user'
    });

    let responseArray = [];

    for (var i = 0; i < input.length; i++) {

        let responseObject = {};
        responseObject['name'] = input[i]['user']['name'];
        responseObject['lengthLivingInNeighborhood'] = input[i]['lengthLivingInNeighborhood'];
        responseObject['neighborhoodSatisfactionScale'] = input[i]['neighborhoodSatisfaction'];
        responseObject['publicTransportationTips'] = input[i]['publicTransportationTips'];
        responseObject['safetyTips'] = input[i]['safetyTips'];
        responseObject['favAspectsOfNeighborhood'] = input[i]['favAspectsOfNeighborhood'];
        responseObject['slug'] = input[i]['slug'];



        let favPlacesArray = [];
        let favPlacesObject = {};


        for (var u = 0; u < input[i]['favoritePlaces'].length; u++) {

            let favPlace = input[i]['favoritePlaces'][u];
            favPlacesObject['placeDescrption'] = favPlace;
            let imagesArray = [];

            for (var t = 0; t < favPlace['placeImage'].length; t++) {
                //console.log(favPlace['placeImage'][t]);
                let imageBuffer = favPlace['placeImage'][t]['data'];
                imagesArray.push(Buffer.from(imageBuffer, "base64").toString('base64'))
            }

            //let imageBuffer = favPlace['placeImage'][0]['data'];
            favPlacesObject['placeImageBuffer'] = imagesArray;

            //Buffer.from(imageBuffer, "base64").toString('base64')
            favPlacesArray.push(favPlacesObject);

        }
        responseObject['favoritePlaces'] = favPlacesArray;
        responseArray.push(responseObject);
    }





    res.status(201).json({
        success: true,
        data: responseArray
    })



});




//@dsc      Render the form after the user has logged in
//@route    GET /users/id:
//@access   Private 
exports.getFormInterface = asyncHandler(async (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public', 'index3.html'))
})



//@dsc      Render the form after the user has logged in
//@route    GET /users/:id/profile
//@access   Private 
exports.userProfile = asyncHandler(async (req, res, next) => {


    let favPlaces = req.user[0].favoritePlaces;

    let amountOfPhotosPerPlace = [];
    let filesNamesArrayMain = [];
    for (var w = 0; w < favPlaces.length; w++) {

        let filesNamesArray = [];
        amountOfPhotosPerPlace.push(req.user[0].favoritePlaces[w]['placeImage'].length);

        for (var c = 0; c < req.user[0].favoritePlaces[w]['placeImage'].length; c++) {
            let filesNames = req.user[0].favoritePlaces[w]['placeImage'][c].filename;
            filesNamesArray.push(filesNames)
        }
        filesNamesArrayMain.push(filesNamesArray)
    }


    let mainArray = [];
    const iterateArrayOfImages = function () {
        for (var t = 0; t < filesNamesArrayMain.length; t++) {
            let currentElementMainArray = filesNamesArrayMain[t];
            for (var y = 0; y < currentElementMainArray.length; y++) {
                let placeName = currentElementMainArray[y];
                let readstream = gfs.createReadStream(placeName);
                let fileChunks = [];
                let imageFormated;
                readstream.on('data', function (chunk) {
                    fileChunks.push(chunk);
                });
                readstream.on('end', function () {
                    let concatFile = Buffer.concat(fileChunks);

                    if (y === 0) {
                        imageFormated = `<img src="data:image/png;base64,${Buffer(concatFile).toString("base64")}"/>`;
                    }else{
                        imageFormated = `<img style="display:none;" src="data:image/png;base64,${Buffer(concatFile).toString("base64")}"/>`;
                    }

                    mainArray.push(imageFormated);

                });
            }
        }
    }

    iterateArrayOfImages();


    setTimeout(() => {

        let mainArrayDivided = [];

        for (var q = 0; q < amountOfPhotosPerPlace.length; q++) {
            var amountOfPhotosForPlace = amountOfPhotosPerPlace[q];

            let arr = [];
            for (var c = 0; c < amountOfPhotosForPlace; c++) {

                let item = mainArray[c]
                arr.push(item);

            }
            mainArrayDivided.push(arr)
        }

        let livingInNhood;
        if (req.user[0].lengthLivingInNeighborhood === 'do not live there') {
            livingInNhood = 'I do not live in this neighborhood, but I know it well enough to take you to the best places.'
        } else {
            livingInNhood = `I have been living in this neighborhood ${req.user[0].lengthLivingInNeighborhood},and I know it well enough to take you to the best places.`
        }

        var introduction1 = `Hello! <span class='introHighlight'> My name is ${req.user[0].name}, and if you want to visit ${req.user[0].neighborhood} I can show around</span> . ${livingInNhood}`
        var introduction2 = `<b>I would describe ${req.user[0].neighborhood} as follows:</b> `
        var introduction3 = `${req.user[0].neighborhoodDescription}`
        var introduction4 = `<b>In three words, I would say ${req.user[0].neighborhood} is:</b>`
        var introduction5 = `${req.user[0].threeWordsToDecribeNeighborhood}`.split(',')
        var introduction6 = `Please keep exploring my profile if you want to learn more about ${req.user[0].neighborhood}, and get to know New York City like very few visitors do.`

        var intro = [introduction1, [introduction2, introduction3], [introduction4, introduction5], introduction6];

        let user = {
            'name': req.user[0].name,
            'neighborhood': req.user[0].neighborhood,
            'threeWordsToDecribeNeighborhood': req.user[0].threeWordsToDecribeNeighborhood,
            'neighborhoodTips': req.user[0].neighborhoodTips,
            'neighborhoodDescription': req.user[0].neighborhoodDescription,
            'neighborhoodSatisfaction': req.user[0].neighborhoodSatisfaction,
            'neighborhoodFactorDescription': req.user[0].neighborhoodFactorDescription,
            'favoritePlaces': req.user[0].favoritePlaces,
            'lengthLivingInNeighborhood': req.user[0].lengthLivingInNeighborhood,
            'imagesFormated': mainArrayDivided,
            'intro': intro
        }
        res.render("user_profile", { user });


    }, 15000);

})




//@desc     Get user profile 
//@route    GET /users/profile/:slug
//@access   Public
exports.user_ProfilePublic = asyncHandler(async (req, res, next) => {

    console.log('kikikikikikiki');

    var slug = req.params.slug;


    // HERE INSTEADT OF QUERYING THE Inputs SCHEMA, I WILL HAVE TO QUERY THE Users SCHEMA.
    var input = await Inputs.find({ 'slug': slug }).populate({ // <<<<--------------------------------------------------------
        path: 'user'
    });

    let favPlaces = input[0].favoritePlaces;
    let imagesFormated = [];
    for (var i = 0; i < favPlaces.length; i++) {
        let images = [];
        for (var t = 0; t < favPlaces[i].placeImage.length; t++) {
            let img = Buffer.from(favPlaces[i].placeImage[t].data.buffer, 'base64');
            let formated_image
            if (t === 0) {
                formated_image = `<img src="data:image/png;base64,${img.toString("base64")}"/>`;
            } else {
                formated_image = `<img style="display:none;" src="data:image/png;base64,${img.toString("base64")}"/>`;
            }
            images.push(formated_image);
        }
        imagesFormated.push(images)
    }

    let livingInNhood;
    if (input[0].lengthLivingInNeighborhood === 'do not live there') {
        livingInNhood = 'I do not live in this neighborhood, but I know it well enough to take you to the best places.'
    } else {
        livingInNhood = `I have been living in this neighborhood ${input[0].lengthLivingInNeighborhood},and I know it well enough to take you to the best places.`
    }


    var introduction1 = `Hello! <span class='introHighlight'> My name is ${input[0]['user'].name}, and if you want to visit ${input[0].neighborhood} I can show around</span> . ${livingInNhood}`
    var introduction2 = `<b>I would describe ${input[0].neighborhood} as follows:</b> `
    var introduction3 = `${input[0].neighborhoodDescription}`
    var introduction4 = `<b>In three words, I would describe ${input[0].neighborhood} as:</b>`
    var introduction5 = `${input[0].threeWordsToDecribeNeighborhood}`.split(',')
    var introduction6 = `Please keep exploring my profile if you want to learn more about ${input[0].neighborhood}, and get to know New York City like very few visitors do.`

    var intro = [introduction1, [introduction2, introduction3], [introduction4, introduction5], introduction6];


    console.log(input);

    let user = {
        'name': input[0]['user'].name,
        'neighborhood': input[0].neighborhood,
        'threeWordsToDecribeNeighborhood': input[0].threeWordsToDecribeNeighborhood,
        'neighborhoodTips': input[0].neighborhoodTips,
        'neighborhoodDescription': input[0].neighborhoodDescription,
        'neighborhoodSatisfaction': input[0].neighborhoodSatisfaction,
        'neighborhoodFactorDescription': input[0].neighborhoodFactorDescription,
        'favoritePlaces': input[0].favoritePlaces,
        'lengthLivingInNeighborhood': input[0].lengthLivingInNeighborhood,
        'imagesFormated': imagesFormated,
        'intro': intro
    }

    res.render("user_profile", { user });

});







//@desc     Create user
//@route    POST /auth/users
//@access   Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    })
});


//@desc     Update user
//@route    PUT /auth/users/:id
//@access   Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: user
    })
});



//@desc     Delete user
//@route    DELETE /auth/users/:id
//@access   Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    })
});






