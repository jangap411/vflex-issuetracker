const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes/index");

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// health check route
app.get("/health", (req, res) => {
  res.send("Hello, World!");
});

/**
 *
 * api routes
 *
 * */
//
app.use("/api/v1", routes);

//404 handler
app.all(/.*/, (req, res) => {
  res.status(404).json({
    message: "404 not found",
  });
});

// error handler
app.use((err, req, res, next) => {
  console.log("\n\n\nError handler middleware called\n\n\n");
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

//export the app
module.exports = app;
