const express = require("express");

const {
    getUsers,
    getFormInterface,
    userProfile,
    getNeighborhood,
    user_ProfilePublic,
} = require("../controllers/users");


const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

// Base route: "/users"
router.route('/')
    .get(advancedResults(User), getUsers)

router.route('/neighborhood/:neighborhood')
    .get(getNeighborhood);


router.route('/questionnaire')//:refreshToken
    .get(protect, getFormInterface)

router.route('/profile')///:id
    .get(protect, userProfile)


router.route('/user-profile/:slug')
    .get(user_ProfilePublic)


module.exports = router;