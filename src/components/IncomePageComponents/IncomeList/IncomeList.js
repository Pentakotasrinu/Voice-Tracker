import React from 'react';
import './IncomeList.css';

const IncomeList = ({ incomeList }) => {
  return (
    <div className="income-list-wrapper">
      <h2 className="income-list-heading">💰 All Income 💰</h2>
      {incomeList.length === 0 ? (
        <p className="income-list-empty">No income entries found.</p>
      ) : (
        <div className="income-table-wrapper">
          <table className="income-table">
            <thead>
              <tr className="income-table-header">
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((income, index) => (
                <tr className="income-table-row" key={index}>
                  <td>{new Date(income.date).toLocaleDateString()}</td>
                  <td>{income.title}</td>
                  <td>₹ {Number(income.amount).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
            {incomeList.length > 0 && (
              <tfoot>
                <tr className="income-total-row">
                  <td colSpan="2"><strong>Total</strong></td>
                  <td>
                    ₹ {incomeList.reduce((acc, cur) => acc + Number(cur.amount), 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
};

export default IncomeList;
