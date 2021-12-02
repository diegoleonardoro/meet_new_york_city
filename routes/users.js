const express = require("express");

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getFormInterface,
    userProfile,
    getNeighborhood,
} = require("../controllers/users");


const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

// Base route: "/users"
router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router.route('/neighborhood/:neighborhood')
    .get(getNeighborhood)

router.route('/:id')
    .get(protect, getFormInterface)
    .put(updateUser)
    .delete(deleteUser);

router.route('/profile/:id')
    .get(protect, userProfile)

module.exports = router;