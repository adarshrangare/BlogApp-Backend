const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { sendEmail } = require("../utils/sendEmail");

const createUser = async (req, res) => {
  const { fullname, username, email, password, gender, profile } = req.body;
  //   console.log({ User });

  //   return res.json({ name, username, email, password, gender, profile });

  //   console.log({ fullname, username, email, password, gender, profile });

  if (!fullname || !username || !email || !password || !gender) {
    return res
      .status(400)
      .json({ status: "failed", message: "Please fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(409)
        .json({ status: "failed", message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: encryptedPassword,
      gender,
      profile,
    });

    if (newUser) {
      return res.status(201).json({
        status: "success",
        message: "Account is created successfully",
        data: {
          fullname,
          username,
          email,
          gender,
          profile,
        },
      });
    }
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
};

const signInUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    }).select("-blogs");

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User does not exist" });
    }
    // console.log("checking")
    // console.log(user.fullname);

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log({ isPasswordCorrect });
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ status: "failed", message: "Password is Incorrect" });
    }

    console.log({ isPasswordCorrect });

    const token = jwt.sign(
      {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profile: user.profile,
        gender: user.gender,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: 60 * 60 * 24 * 15, // expires in 15days (in Seconds)
      }
    );

    delete user.password;

    return res
      .status(200)
      .json({ status: "success", message: "logged in successfully", token });
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
};

const checkUserName = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ status: "failed", message: "Enter username" });
  }

  try {
    const user = await User.findOne({ username: username });
    // console.log(user)
    if (!user) {
      return res
        .status(200)
        .json({ status: "success", message: "username is available" });
    } else {
      return res
        .status(409)
        .json({ status: "failed", message: "username is already taken" });
    }
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    return res
      .status(200)
      .json({
        status: "success",
        message: "Profile is fetched successfully",
        data: { user: req.user },
      });
  } catch (error) {
    res.status(400).json({ status: "failed", error: error.message });
  }
};

module.exports = {
  createUser,
  signInUser,
  checkUserName,
  getUserProfile,
};
