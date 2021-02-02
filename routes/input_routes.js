
const express = require("express");

const {
    getInterface,
    getInputs,
    createInput,
    getInput,
    updateInput,
    deleteInput,
    getInputsInRadious,
    placePhotoUpload
} = require("../controllers/inputs.js")


const Inputs = require("../models/User_input");
const advancedResults = require("../middleware/advancedResults");


// Include the router of other resources
const realEstateVarsRouter = require("./realestatevars_routes");
const reviewRouter = require("./reviews");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth") // wherever we use "protect" the user has to be logged in. 
// only a publisher or an adming can create and manage inputs

// Re-route to other resources 
router.use("/:placeId/realEstateVars", realEstateVarsRouter);// Whenever this route is hit, we will use the "realEstateVarsRouter" router 
router.use("/:placeId/reviews", reviewRouter);


router
    .route("/radius/:zipcode/:distance")
    .get(getInputsInRadious);


router
    .route("/:id/photo")
    .put(protect, authorize('publisher', 'admin'), placePhotoUpload); // We want to protect this route because only authorized users can upload the photo. 
// The authorization will consists on getting the token from the user that is logged in. This token will have his/her encrypted id, and we will use it to get the user from the data base and store in req.user
// authorize() uses req.user.role, which is a value set by "protect", so we need to include authorize() after "protect".

router
    .get(getInterface);


router
    .route("/")
    .get(advancedResults(Inputs, "realEstateVars"), getInputs) // "realEstateVars" is the virtual that we created in the Inputs schema. This virtual lets us insert realEstateVars records into the Inputs schema as long as their ids match.
    .post(protect, authorize('publisher', 'admin'), createInput);


router
    .route("/:id")
    .get(getInput)
    .put(protect, authorize('publisher', 'admin'), updateInput)
    .delete(protect, authorize('publisher', 'admin'), deleteInput);


module.exports = router;