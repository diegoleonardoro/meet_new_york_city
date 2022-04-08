const express = require("express");
const {
    register,
    login,
    confirmEmailToken
} = require("../controllers/auth");


//BASE ROUTE IS '/auth'
const router = express.Router();

router.post("/login", login);
router.post("/confirmEmailToken/:emailToken", confirmEmailToken);



module.exports = router;