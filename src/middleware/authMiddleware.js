const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ status: "fail", message: "Access Denied, Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decoded);
    const user = await User.findById(decoded._id).select("-password");
    // console.log(user);
    if (!user) {
      return res.status(401).json({ status: "fail", message: "Invalid Token" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ status: "failed", error: error?.message });
  }
};

module.exports = authMiddleware;
