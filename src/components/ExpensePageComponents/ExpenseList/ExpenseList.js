import React from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, fetchExpenses }) => {
  // Sort expenses by date (latest first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="expense-list-page-container">
      <h2 className="expense-list-title">💳 All Expenses</h2>
      {sortedExpenses.length === 0 ? (
        <p className="expense-empty">No expenses found.</p>
      ) : (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((expense, index) => (
              <tr key={index}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td className="capitalize">{expense.category}</td>
                <td>₹ {Number(expense.amount).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
          {expenses.length > 0 && (
            <tr className="income-total-row">
              <td colSpan="2"><strong>Total</strong></td>
              <td>
                ₹ {expenses.reduce((acc, cur) => acc + Number(cur.amount), 0).toLocaleString('en-IN')}
              </td>
            </tr>
          )}
        </table>
      )}
    </div>
  );
};

export default ExpenseList;
