import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/DashboardPageComponents/Navbar/Navbar";
import OverviewCards from "./components/DashboardPageComponents/OverviewCards/OverviewCards";
import VoiceInputButton from "./components/DashboardPageComponents/VoiceInputButton/VoiceInputButton";
import ChartsSection from "./components/DashboardPageComponents/ChartsSection/ChartsSection";
// import RecentTransactions from "./components/DashboardPageComponents/RecentTransactions/RecentTransactions";
import AddExpense from "./components/DashboardPageComponents/AddExpense/AddExpense";
import Login from "./components/DashboardPageComponents/Login/Login";
import Signup from "./components/DashboardPageComponents/Signup/Signup";
import AddSalary from "./components/DashboardPageComponents/AddSalary/AddSalary";
import IncomeCard from "./components/DashboardPageComponents/IncomeCard/IncomeCard";
import IncomeList from "./components/DashboardPageComponents/IncomeList/IncomeList";
import ExpenseList from "./components/DashboardPageComponents/ExpenseList/ExpenseList";
import FinGenie from "./components/DashboardPageComponents/FinGenie/FinGenie";
import ExpensesPage from "./components/ExpensePageComponents/ExpensesPage/ExpensesPage";
import IncomePage from "./components/IncomePageComponents/IncomePage/IncomePage";
import AIAssistantPage from "./components/FinGeniePageComponents/AIAssistantPage/AIAssistantPage";
import "./App.css";

// background: linear-gradient(135deg, #06090c, #3a4c71);

const App = () => {
  const { user, logout } = useContext(AuthContext);
  // const [isRecording, setIsRecording] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [incomeList, setIncomeList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  // Read user from localStorage if not available in AuthContext
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = user || storedUser; // ✅ Ensures user persists after refresh
  const userEmail = currentUser?.email || null;

  // Fetch Expenses API
  const fetchExpenses = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/expenses?email=${userEmail}`
      );
      const data = await res.json();

      if (data.expenses) {
        setExpenses(data.expenses);
        setTotalExpenses(data.totalExpenses);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  // Fetch Income API
  const fetchIncome = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/income?email=${userEmail}`
      );
      const data = await res.json();

      setTotalIncome(data.totalIncome);
      setIncomeList(data.incomeRecords);
    } catch (err) {
      console.error("Error fetching income:", err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchExpenses();
      fetchIncome();
    }
  }, [userEmail]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              currentUser ? (
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                  <Navbar email={userEmail} onLogout={logout} />
                  <div className="Main-Dashboard">
                    <OverviewCards
                      totalIncome={totalIncome}
                      totalExpenses={totalExpenses}
                      expenses={expenses}
                    />
                    <IncomeCard totalIncome={totalIncome} />
                    <IncomeList
                      incomeList={incomeList}
                      fetchIncome={fetchIncome}
                    />
                    <div className="flex justify-center">
                      <VoiceInputButton
                        email={userEmail}
                        setTotalIncome={setTotalIncome}
                        setIncomeList={setIncomeList}
                        setTotalExpenses={setTotalExpenses}
                        setExpenses={setExpenses}
                        setShowVoiceModal={setShowVoiceModal}
                      />
                    </div>
                    <ChartsSection expenses={expenses} email={userEmail} />
                    <div className="forms-wrapper">
                      <div className="add-income-container">
                        <AddSalary
                          email={userEmail}
                          setIncomeList={setIncomeList}
                          setTotalIncome={setTotalIncome}
                        />
                      </div>
                      <div className="add-expense-container">
                        <AddExpense
                          email={userEmail}
                          setExpenses={setExpenses}
                          setTotalExpenses={setTotalExpenses}
                        />
                      </div>
                    </div>

                    <ExpenseList
                      expenses={expenses}
                      fetchExpenses={fetchExpenses}
                    />

                    {/* <RecentTransactions expensesList={expenses} />   */}
                  </div>
                  <FinGenie email={userEmail} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* <Route path="/expenses" element={<ExpensesPage />} /> */}

          <Route
            path="/expenses"
            element={
              currentUser ? (
                <ExpensesPage
                  expenses={expenses}
                  incomeList={incomeList}
                  totalIncome={totalIncome}
                  totalExpenses={totalExpenses}
                  fetchExpenses={fetchExpenses}
                  fetchIncome={fetchIncome}
                  email={userEmail}
                  logout={logout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/income"
            element={
              <IncomePage
                incomeList={incomeList}
                email={userEmail}
                logout={logout}
                totalExpenses={totalExpenses}
              />
            }
          />
          <Route
            path="/fingenie"
            element={
              <AIAssistantPage
                email={userEmail}
                logout={logout}
                expenses={expenses}
                incomeList={incomeList}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
