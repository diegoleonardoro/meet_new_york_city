const express = require("express");

const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require("../controllers/reviews");


const Reviews = require("../models/Review");

const router = express.Router({ mergeParams: true }); // "/inputs/reviews" will re route to this file 

const { protect, authorize } = require("../middleware/auth") // wherever we use "protect" the user has to be logged in. 
// "protect" makes sure that the user has the correct token 
// "authorize" makes sure that the user has the correct role

const advancedResults = require("../middleware/advancedResults");


// The base route for these routes is "/reviews"
router.route('/')
    .get(advancedResults(Reviews, {
        path: "input",
        select: "location.formattedAddress propertyType userName" // whenever the client makes a request to get the realEstate vars, the response will be populated with the "formattedAddress", "propertyType", "userName" from the Inputs schema and store them in the "input" field, because that's how we defined it in the realEstateVars schema. 
    }), getReviews)
    .post(protect, authorize('user', 'admin'), addReview)




router.route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)





module.exports = router;