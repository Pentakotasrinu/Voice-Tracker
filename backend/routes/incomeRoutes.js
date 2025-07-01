const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// ✅ Add Income
router.post('/add', async (req, res) => {
  try {
    const { email, title, amount, date } = req.body;

    console.log(req.body);

    if (!email || !title || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newIncome = new Income({ email, title, amount, date });
    await newIncome.save();

    res.status(201).json({ message: 'Income added successfully', income: newIncome });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Total Income & Individual Records for a User
router.get('/', async (req, res) => {
    try {
      const { email } = req.query;
  
      // Find all income records for the user
      const incomeRecords = await Income.find({ email });
  
      if (!incomeRecords.length) {
        return res.status(404).json({ message: 'No income records found' });
      }
  
      // ✅ Calculate Total Income
      const totalIncome = incomeRecords.reduce((sum, entry) => sum + entry.amount, 0);
  
      res.status(200).json({ totalIncome, incomeRecords });
      console.log(totalIncome)
      console.log(incomeRecords)
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // ✅ Find Income Before Deleting (For Duplicate Handling)
  router.get('/findIncomeToDelete', async (req, res) => {
    try {
      const { email, title, amount, date } = req.query;

      if (!email || !title || !amount || !date) {
        return res.status(400).json({ message: "All fields are required to find income." });
      }

      // Find all matching records
      const incomes = await Income.find({ email, title, amount, date });

      if (incomes.length === 0) {
        return res.status(404).json({ message: "No matching income found." });
      }

      // Send list of matches to the frontend for user selection
      res.json({ incomes });

    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  });

  // ✅ Delete a Specific Income by ID
  router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params;

      // Find the income entry and delete it
      const deletedIncome = await Income.findByIdAndDelete(id);

      if (!deletedIncome) {
        return res.status(404).json({ message: 'Income record not found' });
      }

      res.status(200).json({ message: 'Income deleted successfully', deletedIncome });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  
  module.exports = router;