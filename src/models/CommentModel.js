const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: { type: String, required: true },
    likes: {
      type: Number,
      default: 0,
    },
    isNested: Boolean,
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
    blog: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
