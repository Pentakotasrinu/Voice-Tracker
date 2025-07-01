const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config(); // Ensure environment variables are loaded

router.post("/", async (req, res) => {
  const { message } = req.body;

  // Validate the message input
  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: 'Invalid or missing "message" field' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Ensure the API key is set in your environment

  if (!GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing Gemini API key in environment variables" });
  }

  try {
    // Send a request to the Gemini API
    const response = await axios.post(
      "https://api.gemini.ai/v1/completions", // Example Gemini API endpoint (you must replace it with the actual one)
      {
        model: "gemini-1", // Replace with the appropriate model name (check Gemini documentation)
        messages: [{ role: "user", content: message }],
        temperature: 0.7, // Optional parameters for tuning (if Gemini supports them)
        max_tokens: 1000, // Optional parameter, adjust according to your needs
      },
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`, // Authorization header with the Gemini API key
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the reply from Gemini's response (assuming it's similar to OpenAI's format)
    const reply = response.data.choices[0]?.message?.content?.trim();

    // Return the AI response
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);

    // Handle error response
    res.status(500).json({
      error: "Gemini API request failed",
      details: error?.response?.data || error.message,
    });
  }
});

module.exports = router;
