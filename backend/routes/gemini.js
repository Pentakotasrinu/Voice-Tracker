const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: 'Invalid or missing "message" field' });
  }

  if (!GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing Gemini API key in environment variables" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    res.status(500).json({
      error: "Gemini API request failed",
      details: error?.response?.data || error.message,
    });
  }
});

module.exports = router;
