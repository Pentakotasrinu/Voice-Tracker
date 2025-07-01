import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import "./AddSalary.css";

const AddSalary = ({ email, setIncomeList, setTotalIncome }) => {
  const [income, setIncome] = useState({ title: "", amount: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State to show success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncome((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!income.title || !income.amount || !income.date) {
      alert("⚠️ Please fill all income fields!");
      return;
    }

    const newIncome = { email, ...income, amount: parseFloat(income.amount) };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/income/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newIncome),
      });

      const data = await response.json();

      if (response.ok && data.income) {
        // Show success message
        setShowSuccessMessage(true);

        // Fetch updated income list from the backend
        const updatedResponse = await fetch(
          `http://localhost:5000/api/income?email=${email}`
        );
        const updatedData = await updatedResponse.json();

        if (updatedResponse.ok) {
          setIncomeList(updatedData.incomeRecords);
          setTotalIncome(updatedData.totalIncome);
        }

        // Clear form fields
        setIncome({ title: "", amount: "", date: "" });

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        alert(`❌ Failed to add income: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Error adding income: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="income-form animate-form">
      <h2 className="income-form-title">
        Add Salary / Income
        <span className="voice-hint" title="Use voice to add income!">
          <FaMicrophone />
        </span>
      </h2>

      <input
        type="text"
        name="title"
        placeholder="Enter title (e.g., Salary, Bonus)"
        value={income.title}
        onChange={handleChange}
        className="income-input animate-input"
      />

      <input
        type="number"
        name="amount"
        placeholder="Enter amount (₹)"
        value={income.amount}
        onChange={handleChange}
        className="income-input animate-input"
      />

      <input
        type="date"
        name="date"
        value={income.date}
        onChange={handleChange}
        className="income-input animate-input"
      />

      <button
        type="submit"
        className="income-submit-btn animate-btn"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Salary"}
      </button>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message">
          <p>Income added successfully!</p>
        </div>
      )}
    </form>
  );
};

export default AddSalary;
