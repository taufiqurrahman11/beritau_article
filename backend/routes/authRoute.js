const express = require("express");
const { register, login, forgotPassword, verifyEmail } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail)
router.post("/login", login);
router.post("/forgot", forgotPassword)

module.exports = router;
