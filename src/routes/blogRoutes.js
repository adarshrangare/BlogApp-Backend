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
