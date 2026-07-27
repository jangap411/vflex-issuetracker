const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

// create http server
const server = http.createServer(app);

// connect to database
connectDB();

// start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  server.close(() => {
    process.exit(1);
  });
});
