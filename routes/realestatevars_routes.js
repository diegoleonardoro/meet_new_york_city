const express = require("express");

const {
    getRealEstateVars,
    getSingleRealEstateVars,
    addRealEstateVars,
    updateRealEstateVars,
    deleteRealEstateVars
} = require("../controllers/realEstateVars");


const RealEstateVarsSchema = require("../models/RealEstateVars");


const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth") // wherever we use "protect" the user has to be logged in. 
const advancedResults = require("../middleware/advancedResults");


// The base route for these routes is "/realEstateVars"
router.route('/')
    .get(advancedResults(RealEstateVarsSchema, {
        path: "input",
        select: "location.formattedAddress propertyType userName" // whenever the client makes a request to get the realEstate vars, the response will be populated with the "formattedAddress", "propertyType", "userName" from the Inputs schema and store them in the "input" field, because that's how we defined it in the realEstateVars schema. 
    }), getRealEstateVars)
    .post(protect, authorize('publisher', 'admin'), addRealEstateVars);

router.route('/:id')
    .get(getSingleRealEstateVars)
    .put(protect, updateRealEstateVars)
    .delete(protect, deleteRealEstateVars);


module.exports = router;