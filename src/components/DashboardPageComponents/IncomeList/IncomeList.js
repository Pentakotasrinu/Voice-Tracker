import React, { useState } from "react";
import "./IncomeList.css";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const IncomeList = ({ incomeList = [], fetchIncome }) => {
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/income/delete/${selectedId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Income deleted successfully!");
        fetchIncome();
      } else {
        setMessage(data.message || "Failed to delete income.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting income.");
    }

    setShowModal(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="income-container">
      <h2 className="income-title">Income Records</h2>

      {message && <div className="income-popup-message">{message}</div>}

      {incomeList.length === 0 ? (
        <p className="no-income-message">No income records found.</p>
      ) : (
        <ul className="income-list">
          {incomeList.map((item) => (
            <li key={item._id} className="income-item">
              <div className="income-left">
                <span className="income-name">{item.title}</span>
              </div>

              <div className="income-right">
                <span className="income-amount">
                  ₹{Number(item.amount).toLocaleString("en-IN")}
                </span>
                <span className="income-date">
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <button
                  className="income-delete-btn"
                  onClick={() => {
                    setSelectedId(item._id);
                    setShowModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmationModal
        message="Are you sure you want to delete this income record?"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
        isVisible={showModal} // ✅ This enables modal rendering
      />
    </div>
  );
};

export default IncomeList;
