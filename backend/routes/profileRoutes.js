const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

// Get profile by userId
router.get("/:userId", profileController.getProfile);

// Update profile by userId
router.put("/:userId", profileController.updateProfile);

module.exports = router;