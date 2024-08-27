/**
 * @swagger
 * /api/v1/comments/{blogId}/addComment:
 *   post:
 *     tags:
 *       - Comment
 *     summary: Add a comment to a blog post
 *     description: Allows an authenticated user to comment on a blog post
 *     parameters:
 *       - in: path
 *         name: blogId
 *         type: string
 *         required: true
 *         description: The ID of the blog post
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               example: 'This is my comment.'
 *     responses:
 *       201:
 *         description: Comment added
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   patch:
 *     tags:
 *       - Comment
 *     summary: Edit a comment
 *     description: Allows an authenticated user to edit a comment
 *     parameters:
 *       - in: path
 *         name: commentId
 *         type: string
 *         required: true
 *         description: The ID of the comment
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: Comment edited
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 *   delete:
 *     tags:
 *       - Comment
 *     summary: Delete a comment
 *     description: Allows an authenticated user to delete a comment
 *     parameters:
 *       - in: path
 *         name: commentId
 *         type: string
 *         required: true
 *         description: The ID of the comment
 *       - in: header
 *         name: Authorization
 *         type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: Comment deleted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */


const express = require("express");

const router = express.Router();

const {
  createComment,
  getCommentsByBlog,
  deleteComment,
  updateComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");




router.get("/blogId/:blogId", getCommentsByBlog);
router.post("/:blogId/addComment", authMiddleware, createComment);
router.patch("/:commentId", authMiddleware, updateComment);
router.delete("/:commentId", authMiddleware, deleteComment);

module.exports = router;
