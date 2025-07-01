const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  email: { type: String, required: true }, // User's email
  title: { type: String, required: true }, // Salary, bonus, etc.
  amount: { type: Number, required: true, min: 1 }, // Ensure valid positive amount
  date: { type: Date, required: true }, // Date of income
  createdAt: { type: Date, default: Date.now } // Auto-generated timestamp
});

module.exports = mongoose.model('Income', incomeSchema);
