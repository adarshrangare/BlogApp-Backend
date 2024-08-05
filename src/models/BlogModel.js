const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, model } = require("mongoose");


const blogSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 3,
      required: true,
    },
    description: {
      type: String,
      minlength: 3,
      required: true,
    },
    tags: {
      type: [String],
      default: ["General"],
      required: true,
    },
    imageURL: {
      type: String,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    upvote: {
      type: Number,
      default: 0,
    },
    downvote: {
      type: Number,
      default: 0,
    },
    votedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

blogSchema.plugin(mongoosePaginate);

const Blog = model("Blog", blogSchema);

module.exports = Blog;
