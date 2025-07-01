import React from "react";
import "./IncomeCard.css"; // Import CSS

const IncomeCard = ({ totalIncome }) => {
  return (
    <div className="income-card">
      <h2 className="card-title">Total Income</h2>
      <p className="card-value">
        ₹{Number(totalIncome).toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default IncomeCard;
