const express = require("express");

const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/users");


const User = require("../models/User");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth")
const advancedResults = require("../middleware/advancedResults");

// Everything below these two lines will use the protect and authorize() middlewares
router.use(protect);
router.use(authorize('admin'));

//"/users" is the base url
router.route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);



module.exports = router;