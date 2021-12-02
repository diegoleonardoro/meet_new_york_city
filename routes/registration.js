const express = require('express');

const {
    Registration_Interface,
    register_User,
    login_interface,
    login
} = require('../controllers/registration')



// Base route:  '/reigser'

const router = express.Router();

router
    .route("/")
    .get(Registration_Interface) 
    .post(register_User)


router
    .route("/login")
    .get(login_interface) // render the registration template.
    .post(login)// post the regustration variables.


module.exports = router;