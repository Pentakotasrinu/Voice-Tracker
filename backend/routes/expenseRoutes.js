const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// ✅ Add Expense
router.post('/add', async (req, res) => {
    try {
        const { email, title, amount, date, category } = req.body;

        if (!email || !title || !amount || !date || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExpense = new Expense({ email, title, amount, date, category });
        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { email } = req.query; // ✅ Get email from query params

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // ✅ Find expenses for the given email
        const expenses = await Expense.find({ email });

        // ✅ Calculate total expenses sum
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // ✅ Send response with both expenses list and total sum
        res.json({ totalExpenses, expenses });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});



// ✅ Find Expense Before Deleting (For Duplicate Handling)
router.get('/findExpenseToDelete', async (req, res) => {
    try {
        const { email, title, amount, date, category } = req.query;

        if (!email || !title || !amount || !date || !category) {
            return res.status(400).json({ message: "All fields are required to find the expense." });
        }

        // Find all matching records
        const expenses = await Expense.find({ email, title, amount, date, category });

        if (expenses.length === 0) {
            return res.status(404).json({ message: "No matching expense found." });
        }

        // Send list of matches to the frontend for user selection
        res.json({ expenses });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Delete a Specific Expense by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the expense entry and delete it
        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense record not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully', deletedExpense });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;