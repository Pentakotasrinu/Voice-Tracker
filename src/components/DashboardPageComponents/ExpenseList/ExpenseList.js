// src/components/ExpenseList.js
import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import "./ExpenseList.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const ExpenseList = ({ expenses, fetchExpenses }) => {
  const [showModal, setShowModal] = useState(false); // For showing confirmation modal
  const [selectedExpenseId, setSelectedExpenseId] = useState(null); // Expense ID to delete
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // For showing success message

  const handleDelete = (id) => {
    setSelectedExpenseId(id); // Set the expense ID to delete
    setShowModal(true); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/expenses/delete/${selectedExpenseId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setShowSuccessMessage(true); // Show success message
        setTimeout(() => {
          setShowSuccessMessage(false); // Hide the success message after 3 seconds
          fetchExpenses(); // Fetch updated expenses
        }, 3000);
      } else {
        toast.error(data.message || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting expense.");
    }

    setShowModal(false); // Close the confirmation modal
  };

  const cancelDelete = () => {
    setShowModal(false); // Close the confirmation modal without deleting
  };

  return (
    <div className="expense-list-container animate-container">
      <h2 className="expense-list-title">
        Recent Expenses
        <span className="voice-hint" title="Use voice to filter expenses!">
          <FaMicrophone />
        </span>
      </h2>

      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses added yet.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense._id} className="expense-item animate-item">
              <div className="expense-left">
                <span className="expense-category">{expense.category}</span>
                <span className="expense-title">{expense.title}</span>
              </div>

              <div className="expense-right">
                <span className="expense-amount">₹{expense.amount}</span>
                <span className="expense-date">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(expense._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Use the generic ConfirmationModal component */}
      <ConfirmationModal
        message="Are you sure you want to delete this expense?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isVisible={showModal}
      />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="success-message-delete-expense">
          <p>Expense deleted successfully!</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
