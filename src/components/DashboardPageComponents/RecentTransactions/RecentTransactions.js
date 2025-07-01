import React from "react";
import "./RecentTransactions.css"; // Import CSS

const transactions = [
  { date: "2025-02-19", amount: 128.5, category: "Groceries", merchant: "Whole Foods Market" },
  { date: "2025-02-18", amount: 45.99, category: "Entertainment", merchant: "Netflix" },
  { date: "2025-02-17", amount: 89.99, category: "Shopping", merchant: "Amazon" },
  { date: "2025-02-16", amount: 34.5, category: "Dining", merchant: "Olive Garden" },
  { date: "2025-02-15", amount: 156.78, category: "Utilities", merchant: "AT&T" },
];

const RecentTransactions = (expensesList) => {
  console.log(expensesList)
  return (
    <div className="transactions-container">
      <h3 className="transactions-title">Recent Transactions</h3>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="transaction-item">
            <div>
              <p className="transaction-merchant">{transaction.merchant}</p>
              <p className="transaction-date">{transaction.date}</p>
            </div>
            <div className="text-right">
              <p className="transaction-amount">₹{transaction.amount.toFixed(2)}</p>
              <p className="transaction-category">{transaction.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
