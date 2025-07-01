import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ExpenseList from '../ExpenseList/ExpenseList';
import ExpenseSummary from '../ExpenseSummary/ExpenseSummary'; // optional
import './ExpensesPage.css';
import Navbar from '../../DashboardPageComponents/Navbar/Navbar';

const ExpensesPage = ({
  expenses,
  incomeList,
  totalIncome,
  totalExpenses,
  fetchExpenses,
  fetchIncome,
  email,
  logout
}) => {
  return (
    <div>
      <Navbar email={email} onLogout={logout} />
      <div className="expenses-page-container">
        <Sidebar />
        <main className="expenses-content">
          <h1 className="text-2xl font-bold mb-4">Your Expenses</h1>
          <ExpenseSummary 
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />
          <ExpenseList 
            expenses={expenses}
            fetchExpenses={fetchExpenses}
          />
        </main>
      </div>  
    </div>
    
  );
};

export default ExpensesPage;
