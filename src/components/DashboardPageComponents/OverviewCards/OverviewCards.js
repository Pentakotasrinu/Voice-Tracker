import React from "react";
import { FaMicrophone } from "react-icons/fa";
import "./OverviewCards.css";

const OverviewCards = ({ totalIncome, totalExpenses, expenses }) => {
  const savings = totalIncome - totalExpenses;

  const highestExpense = expenses.length > 0
    ? Math.max(...expenses.map(exp => exp.amount))
    : 0;

  return (
    <div className="overview-grid">
      <div className="overview-card animate-card">
        <h3>Total Spending</h3>
        <p className="main-value text-cyan animate-value">₹ {totalExpenses.toLocaleString("en-IN")}</p>
        <p className="subtext">+12.5% from last month</p>
      </div>

      <div className="overview-card animate-card">
        <h3>Highest Expense</h3>
        <p className="main-value text-gold animate-value">₹ {highestExpense.toLocaleString("en-IN")}</p>
        <p className="subtext">Among all expense records</p>
      </div>

      <div className="overview-card animate-card">
        <h3>Savings</h3>
        <p className="main-value text-green animate-value">₹ {savings.toLocaleString("en-IN")}</p>
        <p className="subtext voice-hint">
          +5.2% this month
          <span className="voice-icon" title="Ask FinGenie about your savings!">
            <FaMicrophone />
          </span>
        </p>
      </div>
    </div>
  );
};

export default OverviewCards;