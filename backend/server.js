const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// Connect to Database & Start Server
connectDB()
  .then(() => {
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/expenses", require("./routes/expenseRoutes"));
    app.use("/api/income", require("./routes/incomeRoutes"));
    app.use("/api/openai", require("./routes/openAI"));
    app.use("/api/gemini", require("./routes/gemini"));

    // Fallback route
    app.use((req, res) => {
      res.status(404).json({ message: "Endpoint not found" });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
