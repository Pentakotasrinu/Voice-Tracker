import React from "react";
import Sidebar from "../../ExpensePageComponents/Sidebar/Sidebar";
import IncomeList from "../IncomeList/IncomeList";
import "./IncomePage.css"; // optional for styling
import Navbar from "../../DashboardPageComponents/Navbar/Navbar";

const IncomePage = ({ incomeList, email, logout }) => {
  return (
    <div>
      <Navbar email={email} onLogout={logout} />
      <div className="income-page-container">
        <Sidebar />
        <main className="income-content">
          <h1 className="text-2xl font-bold mb-4">Your Income 💸</h1>
          <IncomeList incomeList={incomeList} />
        </main>
      </div>
    </div>
  );
};

export default IncomePage;
