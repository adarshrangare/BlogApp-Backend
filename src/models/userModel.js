const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      unique: false
    },
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 6,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    profile: {
      type: String,
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;