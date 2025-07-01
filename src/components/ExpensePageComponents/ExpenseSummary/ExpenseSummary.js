import React from 'react';
import './ExpenseSummary.css';

const ExpenseSummary = ({ totalIncome, totalExpenses }) => {
  const savings = totalIncome - totalExpenses;

  return (
    <div className="summary-container">
      <div className="summary-card income-card-summ">
        <h4 className="summary-title">Total Income</h4>
        <p className="summary-value">₹ {totalIncome}</p>
      </div>
      <div className="summary-card expenses-card">
        <h4 className="summary-title">Total Expenses</h4>
        <p className="summary-value">₹ {totalExpenses}</p>
      </div>
      <div className="summary-card savings-card">
        <h4 className="summary-title">Savings</h4>
        <p className="summary-value">₹ {savings}</p>
      </div>
    </div>
  );
};

export default ExpenseSummary;
