/**
 * @swagger
 * /api/v1/blogs/create:
 *   post:
 *     tags:
 *       - Blog
 *     summary: Create a new blog post
 *     description: Allows an authenticated user to create a blog post
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               example: 'My First Blog'
 *             description:
 *               example: 'This is the description of the blog post.'
 *             tags:
 *               example: ['tag1', 'tag2']
 *             imageURL:
 *               example: 'https://example.com/image.jpg'
 *     responses:
 *       201:
 *         description: Blog post created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Get blog post by ID
 *     description: Retrieves a specific blog post by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: The ID of the blog post
 *     responses:
 *       200:
 *         description: Blog post fetched
 *       400:
 *         description: Bad request
 *       404:
 *         description: Blog post not found
 *   delete:
 *     tags:
 *       - Blog
 *     summary: Delete blog post by ID
 *     description: Deletes a specific blog post by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: The ID of the blog post
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: Blog post deleted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/blogs/upvote/{id}:
 *   patch:
 *     tags:
 *       - Blog
 *     summary: Upvote a blog post
 *     description: Allows an authenticated user to upvote a blog post
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: The ID of the blog post
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token
 *     responses:
 *       201:
 *         description: Blog post upvoted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */


const express = require("express");
const router = express.Router();

const {
  createBlog,
  getBlog,
  deleteBlog,
  editBlog,
  addUpvote,
  removeUpvote,
} = require("../controllers/blogController");

const authMiddleware = require("../middleware/authMiddleware");



router.post("/create", authMiddleware, createBlog); // create a blog
router.get("/", getBlog); // get all the blogs
router.get("/:id", getBlog); // get  specific blog with id
router.delete("/:id", authMiddleware, deleteBlog); // delete  specific blog with id
router.patch("/:id", authMiddleware, editBlog); // update  specific blog with id
router.patch("/upvote/:id", authMiddleware, addUpvote); // Upvote the blog
router.delete("/upvote/:id", authMiddleware, removeUpvote); // remove Upvote from blog

module.exports = router;
