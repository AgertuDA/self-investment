require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const path = require("path");
const app = express();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cors = require("cors");

connectDB();

app.use(express.json());

app.use(cors());

// Connecting Routes (API routes should come before static file serving)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
app.use("/api/questionnaire", require("./routes/questionnaire"));
app.use("/api/allowance", require("./routes/allowance"));
app.use("/api/hobbies", require("./routes/hobby"));
app.use("/api/proofs", require("./routes/proof"));
app.use("/api/challenges", require("./routes/challenge"));
app.use("/api/rewards", require("./routes/reward"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/admin/dashboard", require("./routes/adminDashboard"));
app.use("/api/notifications", require("./routes/notification"));
app.use("/api/admin", require("./routes/admin"));

// Error Handler Middleware
app.use(errorHandler);

// Serve static files from the React app (after API routes)
const frontendBuildPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendBuildPath));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () =>
  console.log(`Sever running on port ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
