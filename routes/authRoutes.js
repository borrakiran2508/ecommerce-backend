const express = require("express");
const router = express.Router();

const {registerUser, loginUser, dashboard} = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");

const {authorizeRoles} = require("../middleware/roleMiddleware");

//create auth route 
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", protect, authorizeRoles("user", "seller", "admin"), dashboard);

module.exports = router;