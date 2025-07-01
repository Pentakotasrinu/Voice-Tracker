const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    email: { type: String, required: true }, // User's email
    category: { 
        type: String, 
        enum: ['food', 'groceries', 'shopping', 'travelling', 'entertainment', 'others'], 
        required: true 
    },
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 }, // Ensuring positive amount
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now } // Automatically stores creation timestamp
});

module.exports = mongoose.model('Expense', expenseSchema);
