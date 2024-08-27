
/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Allows a user to sign up
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             fullname:
 *               example: 'John Doe'
 *             username:
 *               example: 'johndoe'
 *             email:
 *               example: 'johndoe@example.com'
 *             password:
 *               example: 'password123'
 *             gender:
 *               example: 'Male'
 *             profile:
 *               example: 'https://example.com/profile.jpg'
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict
 */

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags:
 *       - User
 *     summary: User login
 *     description: Allows a user to log in
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               example: 'johndoe@example.com'
 *             password:
 *               example: 'password123'
 *     responses:
 *       200:
 *         description: User authenticated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/myprofile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile
 *     description: Fetches the profile of the authenticated user
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: User profile fetched
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/check-username:
 *   post:
 *     tags:
 *       - User
 *     summary: Check if username is available
 *     description: Checks if a given username is already taken
 *     parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               example: 'johndoe'
 *     responses:
 *       200:
 *         description: Username is available
 *       400:
 *         description: Bad request
 *       409:
 *         description: Username is already taken
 */


const express = require("express");
const router = express.Router();
const {
  createUser,
  signInUser,
  checkUserName,
  getUserProfile
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware")


/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Allows a user to sign up
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 */
router.post("/signup", createUser);
router.post("/login",signInUser);
router.get("/myprofile",authMiddleware,getUserProfile);
router.post("/check-username", checkUserName);
module.exports = router;
