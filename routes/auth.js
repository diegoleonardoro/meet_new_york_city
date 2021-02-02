const express = require("express");
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth")

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe); // the protect middleware will require the correct token for the user to continue. The user will get this token by registering or loggin in with correct credentials. The login method inside auth controllers will send the token to the client via cookies.
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;