import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import "./AddExpense.css";

const AddExpense = ({ email, setExpenses, setTotalExpenses }) => {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    date: "",
    category: "others",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state for success message

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !expense.title ||
      !expense.amount ||
      !expense.date ||
      !expense.category
    ) {
      alert("⚠️ Please fill all expense fields!");
      return;
    }

    const newExpense = {
      email,
      ...expense,
      amount: parseFloat(expense.amount),
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/expenses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      });

      const data = await response.json();

      if (response.ok && data.expense) {
        // Show success message
        setShowSuccessMessage(true);

        // Fetch updated expense list from the backend
        const updatedResponse = await fetch(
          `http://localhost:5000/api/expenses?email=${email}`
        );
        const updatedData = await updatedResponse.json();

        if (updatedResponse.ok) {
          setExpenses(updatedData.expenses);
          setTotalExpenses(updatedData.totalExpenses);
        }

        // Clear form fields
        setExpense({ title: "", amount: "", date: "", category: "others" });

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        alert(`❌ Failed to add expense: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Error adding expense: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-expense-container animate-form"
    >
      <h2 className="expense-form-title">
        Add Expenditure
        <span className="voice-hint" title="Use voice to add expense!">
          <FaMicrophone />
        </span>
      </h2>

      <select
        name="category"
        value={expense.category}
        onChange={handleChange}
        className="add-expense-input animate-input"
      >
        <option value="food">Food</option>
        <option value="groceries">Groceries</option>
        <option value="shopping">Shopping</option>
        <option value="travelling">Travelling</option>
        <option value="entertainment">Entertainment</option>
        <option value="others">Others</option>
      </select>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={expense.title}
        onChange={handleChange}
        className="add-expense-input animate-input"
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={expense.amount}
        onChange={handleChange}
        className="add-expense-input animate-input"
      />
      <input
        type="date"
        name="date"
        value={expense.date}
        onChange={handleChange}
        className="add-expense-input animate-input"
      />
      <button
        type="submit"
        className="add-expense-button animate-btn"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Expenditure"}
      </button>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <p>Expense added successfully!</p>
        </div>
      )}
    </form>
  );
};

export default AddExpense;
