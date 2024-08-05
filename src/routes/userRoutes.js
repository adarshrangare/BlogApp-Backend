const express = require("express");
const router = express.Router();
const {
  createUser,
  signInUser,
  checkUserName,
  getUserProfile
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware")

router.post("/signup", createUser);
router.post("/login",signInUser);
router.get("/myprofile",authMiddleware,getUserProfile);
router.post("/check-username", checkUserName);
module.exports = router;
