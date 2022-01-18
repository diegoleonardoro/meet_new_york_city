const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Grid = require("gridfs-stream");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


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

    var user = await User.find({ 'neighborhood': neighborhood });

    console.log(user[0]);//['neighborhoodFactorDescription']

    let responseArray = [];

    //for (var i = 0; i < input.length; i++) {


    //just sending one user:
    let responseObject = {};
    responseObject['name'] = user[0]['name'];
    responseObject['lengthLivingInNeighborhood'] = user[0]['lengthLivingInNeighborhood'];
    responseObject['neighborhoodSatisfactionScale'] = user[0]['neighborhoodSatisfaction'];
    responseObject['publicTransportationTips'] = user[0]['publicTransportationTips'];
    responseObject['safetyTips'] = user[0]['safetyTips'];
    responseObject['favAspectsOfNeighborhood'] = user[0]['favAspectsOfNeighborhood'];
    responseObject['slug'] = user[0]['slug'];
    responseObject['favoritePlaces'] = user[0]['favoritePlaces'];




    let numofPlaces = []
    for (var l = 0; l < responseObject['favoritePlaces'].length; l++) {
        numofPlaces.push(responseObject['favoritePlaces'][l]['numberOfPhotos']);
    }
    responseObject['numofPlaces'] = numofPlaces;




    //===============================//

    let favPlaces = user[0].favoritePlaces;


    let arr = [];
    let amountOfPhotosPerPlace = [];
    for (var w = 0; w < favPlaces.length; w++) {
        let filesNamesArray = [];
        amountOfPhotosPerPlace.push(favPlaces[w]['placeImage'].length);

        let currentPlace = favPlaces[w];

        for (var c = 0; c < currentPlace['placeImage'].length; c++) {
            let filesNames = currentPlace['placeImage'][c].filename;

            filesNamesArray.push(filesNames)

            arr.push(filesNames)
        }
    };


    let streamFlag = 0;
    let imageFormated;
    let newArr = [];

    function createStream() {
        let filename = arr[streamFlag];

        console.log(filename)
        let readstream = gfs.createReadStream(filename);
        let fileChunks = [];
        readstream.on('data', function (chunk) {
            fileChunks.push(chunk);
        });
        readstream.on('end', function () {
            let concatFile = Buffer.concat(fileChunks);
            imageFormated = Buffer(concatFile).toString("base64");

            newArr.push(imageFormated);

            streamFlag = streamFlag + 1;

            if (newArr.length < arr.length) {
                createStream()
            }
        });
    }
    createStream();
    //===============================//

    setTimeout(() => {

        responseObject['imagesFormated'] = newArr;

        console.log(newArr.length);

        res.status(201).json({
            success: true,
            data: responseObject
        })

    }, 15000);

    //responseObject['favoritePlaces'] = favPlacesArray;
    //responseArray.push(responseObject);
    // }
    /* 
    let favPlacesArray = [];
    let favPlacesObject = {};
    for (var u = 0; u < user[0]['favoritePlaces'].length; u++) {
        let favPlace = user[0]['favoritePlaces'][u];
        favPlacesObject['placeDescrption'] = favPlace;
        let imagesArray = [];

        for (var t = 0; t < favPlace['placeImage'].length; t++) {
            //console.log(favPlace['placeImage'][t]);
            let imageBuffer = favPlace['placeImage'][t]['data']; //<<<<<<<<<
            imagesArray.push(Buffer.from(imageBuffer, "base64").toString('base64'))
        }
        //let imageBuffer = favPlace['placeImage'][0]['data'];
        favPlacesObject['placeImageBuffer'] = imagesArray;
        //Buffer.from(imageBuffer, "base64").toString('base64')
        favPlacesArray.push(favPlacesObject);
    }
    */


});




//@dsc      Render the form after the user has logged in
//@route    GET /users/:emailToken
//@access   Private 
exports.getFormInterface = asyncHandler(async (req, res, next) => {


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
    const user = await User.findOne({ email: decodedRefreshToken.email });




    const accessToken = jwt.sign({
        _id: user.id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });


    res
        .status(200)
        .cookie('token', accessToken)// token, options
        .cookie('refreshToken', refreshToken)
        .json({
            user: user
        })


    res.sendFile(path.join(__dirname, '../public', 'index3.html'));


})









//@dsc      Render the form after the user has logged in
//@route    GET /users/:id/profile
//@access   Private 
exports.userProfile = asyncHandler(async (req, res, next) => {

    let favPlaces = req.user[0].favoritePlaces;

    let arr = [];
    let amountOfPhotosPerPlace = [];

    for (var w = 0; w < favPlaces.length; w++) {
        let filesNamesArray = [];
        amountOfPhotosPerPlace.push(favPlaces[w]['placeImage'].length);

        let currentPlace = favPlaces[w];

        for (var c = 0; c < currentPlace['placeImage'].length; c++) {
            let filesNames = currentPlace['placeImage'][c].filename;

            filesNamesArray.push(filesNames)

            arr.push(filesNames)
        }

    };



    // ---- create stream function that will retreive buffer data from database 
    let streamFlag = 0;
    let imageFormated;
    let newArr = [];

    function createStream() {

        let filename = arr[streamFlag];

        if (filename) {
            let readstream = gfs.createReadStream(filename);
            let fileChunks = [];
            readstream.on('data', function (chunk) {
                fileChunks.push(chunk);
            });
            readstream.on('end', function () {
                let concatFile = Buffer.concat(fileChunks);
                imageFormated = Buffer(concatFile).toString("base64");

                newArr.push(imageFormated);

                streamFlag = streamFlag + 1;

                if (newArr.length < arr.length) {
                    createStream()
                }
            });
        }
    }
    createStream();
    // end of create stream function that will retreive buffer data from database 



    setTimeout(() => {
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
            'imagesFormated': newArr,
            'intro': intro,
            'amountOfPhotosPerPlace': amountOfPhotosPerPlace
        }

        res.render("user_profile", { user });

    }, 10000);






    //gfs.files.find({ filename: { $in: arr } }).toArray((err, files) => {
    /* 
    // Check if files
    if (!files || files.length === 0) {
        //res.render('index', { arr: false });
    } else {
        files.map(file => {
            if (
                file.contentType === 'image/jpeg' ||
                file.contentType === 'image/png'
            ) {
                file.isImage = true;
            } else {
                file.isImage = false;
            }
        });
        //res.render('index', { arr: arr });
    }
    */


    //console.log('arr: ', arr);
    //console.log('files: ', files);

    // });

    /* 
    let mainArray = [];
    const iterateArrayOfImages = function () {
        for (var t = 0; t < arr.length; t++) {
            let placeName = arr[t];
            let readstream = gfs.createReadStream(placeName);
            let fileChunks = [];
            let imageFormated;
            readstream.on('data', function (chunk) {
                fileChunks.push(chunk);
            });
            readstream.on('end', function () {
                let concatFile = Buffer.concat(fileChunks);
                imageFormated = Buffer(concatFile).toString("base64");
                mainArray.push(imageFormated);
            });
        }
    }
    iterateArrayOfImages();

    setTimeout(() => { 

        let mainArrayDivided = [];
        let c = 0;
        let z

        for (var q = 0; q < amountOfPhotosPerPlace.length; q++) {
            var amountOfPhotosForPlace = amountOfPhotosPerPlace[q];
            if (q === 0) {
                z = amountOfPhotosForPlace
            } else {
                z = c + amountOfPhotosForPlace;
            }
            let arre = [];
            for (c; c < z; c++) {
                if (z === 2) {
                }
                let item = mainArray[c];
                arre.push(item);
            }
            c = amountOfPhotosForPlace;
            mainArrayDivided.push(arre)
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
            'imagesFormated': mainArray,
            'intro': intro
        }
        res.render("user_profile", { user });
    }, 15000);
    */

})




//@desc     Get user profile 
//@route    GET /users/profile/:slug
//@access   Public
exports.user_ProfilePublic = asyncHandler(async (req, res, next) => {

    var slug = req.params.slug;

    let user = await User.find({ 'slug': slug }) // <<<<--------------------------------------------------------
    let favPlaces = user[0]['favoritePlaces'];

    let arr = [];
    let amountOfPhotosPerPlace = [];

    for (var w = 0; w < favPlaces.length; w++) {
        let filesNamesArray = [];
        amountOfPhotosPerPlace.push(favPlaces[w]['placeImage'].length);

        let currentPlace = favPlaces[w];

        for (var c = 0; c < currentPlace['placeImage'].length; c++) {
            let filesNames = currentPlace['placeImage'][c].filename;
            filesNamesArray.push(filesNames)
            arr.push(filesNames)
        }
    };


    let streamFlag = 0;
    let imageFormated;
    let newArr = [];
    function createStream() {


        let filename = arr[streamFlag];
        let readstream = gfs.createReadStream(filename);
        let fileChunks = [];
        readstream.on('data', function (chunk) {
            fileChunks.push(chunk);
        });
        readstream.on('end', function () {
            let concatFile = Buffer.concat(fileChunks);
            imageFormated = Buffer(concatFile).toString("base64");


            newArr.push(imageFormated);

            streamFlag = streamFlag + 1;

            if (newArr.length < arr.length) {
                createStream()
            }
        });
    }

    createStream();

    setTimeout(() => {

        let livingInNhood;
        if (user[0].lengthLivingInNeighborhood === 'do not live there') {
            livingInNhood = 'I do not live in this neighborhood, but I know it well enough to take you to the best places.'
        } else {
            livingInNhood = `I have been living in this neighborhood ${user[0].lengthLivingInNeighborhood},and I know it well enough to take you to the best places.`
        }

        var introduction1 = `Hello! <span class='introHighlight'> My name is ${user[0].name}, and if you want to visit ${user[0].neighborhood} I can show around</span> . ${livingInNhood}`
        var introduction2 = `<b>I would describe ${user[0].neighborhood} as follows:</b> `
        var introduction3 = `${user[0].neighborhoodDescription}`
        var introduction4 = `<b>In three words, I would say ${user[0].neighborhood} is:</b>`
        var introduction5 = `${user[0].threeWordsToDecribeNeighborhood}`.split(',')
        var introduction6 = `Please keep exploring my profile if you want to learn more about ${user[0].neighborhood}, and get to know New York City like very few visitors do.`

        var intro = [introduction1, [introduction2, introduction3], [introduction4, introduction5], introduction6];

        user = {
            'name': user[0].name,
            'neighborhood': user[0].neighborhood,
            'threeWordsToDecribeNeighborhood': user[0].threeWordsToDecribeNeighborhood,
            'neighborhoodTips': user[0].neighborhoodTips,
            'neighborhoodDescription': user[0].neighborhoodDescription,
            'neighborhoodSatisfaction': user[0].neighborhoodSatisfaction,
            'neighborhoodFactorDescription': user[0].neighborhoodFactorDescription,
            'favoritePlaces': user[0].favoritePlaces,
            'lengthLivingInNeighborhood': user[0].lengthLivingInNeighborhood,
            'imagesFormated': newArr,
            'intro': intro,
            'amountOfPhotosPerPlace': amountOfPhotosPerPlace
        }
        res.render("user_profile", { user });



    }, 10000);

    /* 
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
    
        user = {
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
*/

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







const addRefreshToken = async (user, refreshToken) => {
    try {
        const existingRefreshTokens = user.security.tokens;

        if (existingRefreshTokens.length < 5) {// if the user has less than 5 tokens, then give it a new token 
            await User.updateOne({ email: user.email }, {
                $push: {
                    'security.token': refreshToken,
                    createdAt: new Date(),
                }
            });
        } else {// if the user already has 5 tokens, then pull the last inserted token and add add a new one 

            // Pull the last token
            await User.updateOne({ email: user.email }, {
                $pull: {
                    'security.tokens': {
                        _id: existingRefreshTokens[0]._id,
                    },
                },
            });

            // Push the new token 
            await User.updateOne({ email: user.email }, {
                $push: {
                    'security.tokens': {
                        refreshToken: refreshToken,
                        createdAt: new Date()
                    }
                }
            })
        }
        return true;
    } catch (error) {
        return false;
    }
}




