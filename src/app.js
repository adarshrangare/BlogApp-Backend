const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
  })
);
const morgan = require("morgan");
app.use(morgan("tiny"));
const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentsRoutes");

app.use(express.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded
app.use(express.json()); // parse JSON from body -- instead of bodyParser

app.use("/health-check", (req, res) => {
  res.status(200).json({ status: 200, message: "Server is in good health" });
});

// blogRoutes
app.use("/api/v1", userRouter);

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);
// app.use("/api/v1/users",userRouter);

module.exports = app;
