const express = require("express");
const app = express();
const cors = require("cors");
// require("./swagger.js")()
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const morgan = require("morgan");

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
  })
);

app.use(morgan("tiny"));

// Import routers
const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentsRoutes");

// Middleware for body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check route
app.use("/health-check", (req, res) => {
  res.status(200).json({ status: 200, message: "Server is in good health" });
});

// Define routes
app.use("/api/v1", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);

// Swagger documentation route
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

module.exports = app;
