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

    var users = await User.find({ 'neighborhood': neighborhood });

    // Create stream for images of places 
    const createStream = (filename) => {

        return new Promise((resolve, reject) => {
            let readstream = gfs.createReadStream(filename);
            let fileChunks = [];

            readstream.on('data', function (chunk) {
                fileChunks.push(chunk);
            });

            readstream.on('end', function () {
                let concatFile = Buffer.concat(fileChunks);
                let imageFormated = Buffer(concatFile).toString("base64");

                resolve(imageFormated)
            });
        })
    }

    const iterateImages = async (currentPlaceImages) => {// this function is going to be called the total amounf of favorite places for all users

        let imagesFormattedArray = [];
        for (var i = 0; i < currentPlaceImages.length; i++) {
            let filename = currentPlaceImages[i].filename;
            let imageFormated = await createStream(filename);

            imagesFormattedArray.push(imageFormated)
            if (i === currentPlaceImages.length - 1) {
                return imagesFormattedArray
            }
        }
    }

    const getImagesOfPlace = async (favPlaces) => {// this function is going to be called for as many users there are.
        let imagesStreamArray = [];

        for (var w = 0; w < favPlaces.length; w++) {// we are going to iterate through all the favorite places of each user.
            let currentPlaceImages = favPlaces[w]['placeImage'];
            let imagesStream = await iterateImages(currentPlaceImages);
            imagesStreamArray.push(imagesStream);
            if (w === favPlaces.length - 1) {
                return imagesStreamArray;
            }
        };
    }
    // end of create stream for images of places 





    // Stream for profile image

    const profileImgStream = async (profileImgFileName) => {
        return new Promise((resolve, reject) => {
            let readstream = gfs.createReadStream(profileImgFileName);
            let fileChunks = [];

            readstream.on('data', function (chunk) {
                fileChunks.push(chunk);
            });

            readstream.on('end', function () {
                let concatFile = Buffer.concat(fileChunks);
                let imageFormated = Buffer(concatFile).toString("base64");

                resolve(imageFormated)
            });
        })

    }
    // end of stream for profile image


    let arrayOfUsers = [];

    const getImages = async () => {

        for (var i = 0; i < users.length; i++) {

            let userObj = {}
            userObj['neighborhoodSatisfaction'] = users[i]['neighborhoodSatisfaction'];
            userObj['neighborhoodFactorDescription'] = users[i]['neighborhoodFactorDescription'];
            userObj['name'] = users[i]['name'];
            userObj['favoritePlaces'] = users[i]['favoritePlaces'];
            userObj['borough'] = users[i]['borough'];
            userObj['lengthLivingInNeighborhood'] = users[i]['lengthLivingInNeighborhood'];
            userObj['neighborhood'] = users[i]['neighborhood'];
            userObj['neighborhoodDescription'] = users[i]['neighborhoodDescription'];

            let favPlaces = users[i]['favoritePlaces'];
            let stream = await getImagesOfPlace(favPlaces);

            let profileImage = users[i]['profileImage'];

            let proFileImgStream = '';
            if (profileImage) {
                proFileImgStream = await profileImgStream(profileImage.filename)
            }

            userObj['imageFormatted'] = stream;
            userObj['profileImg'] = proFileImgStream;

            arrayOfUsers.push(userObj);

        }

    };

    await getImages();

    res.status(201).json({
        success: true,
        data: arrayOfUsers
    })

});





//@dsc      Render the form after the user has logged in
//@route    GET /users/questionnaire
//@access   Private 
exports.getFormInterface = asyncHandler(async (req, res, next) => {

    const accessToken = await jwt.sign({
        _id: req.user.id,
        email: req.user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });

    const profileImgFormatted = [];

    if (req.user.profileImage) {
        function createStream() {
            let readstream = gfs.createReadStream(req.user.profileImage.filename);
            let fileChunks = [];
            readstream.on('data', function (chunk) {
                fileChunks.push(chunk);
            });
            readstream.on('end', function () {
                let concatFile = Buffer.concat(fileChunks);
                imageFormated = Buffer(concatFile).toString("base64");
                profileImgFormatted.push("data:image/png;base64," + imageFormated);
            });
        }
        createStream();
    }

    const responseData = req.user;

    res
        .status(200)
        .cookie('token', accessToken)

    setTimeout(() => {

        if (profileImgFormatted.length === 0) {
            profileImgFormatted.push("https://raw.githubusercontent.com/diegoleonardoro/bronx_tourism/master/2feca4c9330929232091f910dbff7f87.jpg")
        }

        res.render("questionnaire", { user: responseData, profileImage: profileImgFormatted });

    }, 2000);


})







//@dsc      Render the form after the user has logged in
//@route    GET /users/profile
//@access   Private 
exports.userProfile = asyncHandler(async (req, res, next) => {

    let favPlaces = req.user.favoritePlaces;

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

    let profilePicFlag = true;

    const profileImgFormatted = [];


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

        if (req.user.profileImage && profilePicFlag) {

            profilePicFlag = false;

            let readstreamProfilePic = gfs.createReadStream(req.user.profileImage.filename);
            let fileChunks = [];
            readstreamProfilePic.on('data', function (chunk) {
                fileChunks.push(chunk);
            });
            readstreamProfilePic.on('end', function () {
                let concatFile = Buffer.concat(fileChunks);
                imageFormated = Buffer(concatFile).toString("base64");
                profileImgFormatted.push(imageFormated);
            });

        }


    }
    createStream();
    // end of create stream function that will retreive buffer data from database 



    const accessToken = await jwt.sign({
        _id: req.user.id,
        email: req.user.email
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_COOKIE_EXPIRE });


    res
        .status(200)
        .cookie('token', accessToken)

    setTimeout(() => {


        let livingInNhood;
        if (req.user.lengthLivingInNeighborhood === 'do not live there') {
            livingInNhood = `I do not live in ${req.user.neighborhood} but I know it well enough to take you to the best places`
        } else {
            livingInNhood = `I have been living in ${req.user.neighborhood} ${req.user.lengthLivingInNeighborhood}`
        }

        var introduction1 = `My name is ${req.user.name}. ${livingInNhood}, and if you want to visit, I can show around.`
        var introduction2 = `I would describe ${req.user.neighborhood} as follows: ${req.user.neighborhoodDescription}`
        var introduction3 = `Please message me if you want me to show you ${req.user.neighborhood} around.`

        var intro = [introduction1, introduction2, introduction3];

        let user = {
            'name': req.user.name,
            'neighborhood': req.user.neighborhood,
            'threeWordsToDecribeNeighborhood': req.user.threeWordsToDecribeNeighborhood,
            'neighborhoodTips': req.user.neighborhoodTips,
            'neighborhoodDescription': req.user.neighborhoodDescription,
            'neighborhoodSatisfaction': req.user.neighborhoodSatisfaction,
            'neighborhoodFactorDescription': req.user.neighborhoodFactorDescription,
            'favoritePlaces': req.user.favoritePlaces,
            'lengthLivingInNeighborhood': req.user.lengthLivingInNeighborhood,
            'imagesFormated': newArr,
            'intro': intro,
            'amountOfPhotosPerPlace': amountOfPhotosPerPlace,
            'profilePicture': profileImgFormatted,
            'borough': req.user.borough
        }

        res.render("user_profile", { user });

    }, 10000);

})




//@desc     Get user profile 
//@route    GET /users/profile/:slug
//@access   Public
exports.user_ProfilePublic = asyncHandler(async (req, res, next) => {

    var slug = req.params.slug;

    let user = await User.find({ 'slug': slug })
    let favPlaces = user[i][0]['favoritePlaces'];

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




