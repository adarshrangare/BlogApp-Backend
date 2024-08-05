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
