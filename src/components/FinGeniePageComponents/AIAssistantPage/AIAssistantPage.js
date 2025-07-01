import React from 'react';
import './AIAssistantPage.css';
import FinGenieChat from '../FinGenieChat/FinGenieChat';
import Navbar from '../../DashboardPageComponents/Navbar/Navbar';

const AIAssistantPage = ({
  email,
  logout,
  expenses,
  totalExpenses,
  incomeList,
  totalIncome
}) => {
  return (
    <div className="ai-assistant-page">
      <Navbar email={email} onLogout={logout} />
      <div className="ai-assistant-content">
        <h1 className="page-title">FinGenie AI Assistant</h1>
        <div className="chat-interface-container">
          <FinGenieChat
            logout={logout}
            expenses={expenses}
            totalExpenses={totalExpenses}
            incomeList={incomeList}
            totalIncome={totalIncome}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;