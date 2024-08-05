const Comment = require("../models/CommentModel");
const Blog = require("../models/BlogModel");
const User = require("../models/userModel");

// Create a new comment
exports.createComment = async (req, res) => {
  const { message } = req.body;
  //   console.log({ user, message, isNested, parentComment, blog });
  const { isNested, parentComment } = req.query;

  const { blogId } = req.params;

  if (!blogId) {
    return res.status(400).json({ message: "Blog id is required" });
  }
  console.log(blogId);
  // console.log(blogId.length);
  if (blogId.length != 24) {
    return res.status(404).json({
      status: "failed",
      message: "Provided Blog ID is Invalid",
    });
  }

  if (!message) {
    return res
      .status(400)
      .json({ status: "success", message: "Message is required." });
  }
  console.log(req.user);
  try {
    const newComment = new Comment({
      message,
      isNested,
      parentComment,
      blog: blogId,
      user: req.user._id,
    });

    if (isNested && !parentComment) {
      return res
        .status(400)
        .json({ status: "failed", message: "Enter Parent commentId" });
    }

    const savedComment = await newComment.save();

    if (isNested) {
      await Comment.findByIdAndUpdate(
        parentComment,
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );
    } else {
      await Blog.findByIdAndUpdate(blogId, {
        $push: { comments: savedComment._id },
      });
    }

    // await User.findByIdAndUpdate(user, { $push: { comments: savedComment._id } });

    return res.status(201).json({
      status: "success",
      message: "Comment is posted successfully",
      data: { comment: savedComment },
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

// Get all comments for a blog
exports.getCommentsByBlog = async (req, res) => {
  const { blogId } = req.params;

  if (blogId.length != 24) {
    return res.status(404).json({
      status: "failed",
      message: "Provided Blog ID is Invalid",
    });
  }

  try {
    const comments = await Comment.find({ blog: blogId })
      .populate({
        path: "user",
        select: "fullname username profile",
      })
      .populate("comments");

    if (!comments) {
      return res.status(404).json({
        status: "failed",
        message: "No comments found for the given blog.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;

  if (commentId.length != 24) {
    return res.status(404).json({
      status: "failed",
      message: "Provided Blog ID is Invalid",
    });
  }

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        status: "failed",
        message: "No such comment found in database.",
      });
    }

    // console.log({ updatingComment, user: req.user });

    if (comment.user.toString() !== req.user._id) {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorised to perform this action",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      req.body,
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({
        status: "failed",
        message: "The comment with the given ID was not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  if (commentId.length != 24) {
    return res.status(404).json({
      status: "failed",
      message: "Provided Blog ID is Invalid",
    });
  }
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        status: "failed",
        message: "No such comment found in database.",
      });
    }

    // console.log({ updatingComment, user: req.user });

    if (comment.user.toString() !== req.user._id) {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorised to perform this action",
      });
    }

    await Comment.findByIdAndDelete(commentId);
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: { comments: commentId },
    });
    // await User.findByIdAndUpdate(comment.user, {
    //   $pull: { comments: commentId },
    // });

    return res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({ status: "failed", message: error.message });
  }
};
