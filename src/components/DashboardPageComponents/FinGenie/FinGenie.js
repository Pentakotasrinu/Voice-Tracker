import React, { useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";
import "./FinGenie.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B10DC9"];

const FinGenie = ({ email }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/expenses?email=${email}`
      );
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (error) {
      respond("❌ Failed to fetch expenses.");
    }
  };

  const fetchIncome = async () => {
    // New API Call
    try {
      const res = await fetch(
        `http://localhost:5000/api/income?email=${email}`
      );
      const data = await res.json();
      setIncome(data.incomeRecords || []); // Check your backend response
    } catch (error) {
      respond("❌ Failed to fetch income.");
    }
  };

  // Common Functions
  const sumAmount = (items) =>
    items.reduce((acc, item) => acc + item.amount, 0);
  const getMonth = (date) => new Date(date).getMonth() + 1;

  // Data Functions
  const getTotalIncome = () => sumAmount(income); // From Income State
  const getTotalExpenses = () => sumAmount(expenses);

  const getIncomeByMonth = (month) =>
    sumAmount(income.filter((e) => getMonth(e.date) === month));
  const getExpensesByMonth = (month) =>
    sumAmount(
      expenses.filter(
        (e) => e.category !== "income" && getMonth(e.date) === month
      )
    );

  const respond = (text, showChart = null) => {
    setMessages((prev) => [...prev, { sender: "bot", text, showChart }]);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("FinGenie Chat Summary", 10, 10);
    messages.forEach((msg, i) => {
      doc.text(
        `${msg.sender === "user" ? "You" : "FinGenie"}: ${msg.text}`,
        10,
        20 + i * 10
      );
    });
    doc.save("FinGenie_Summary.pdf");
  };

  const fetchFinancialTip = async () => {
    try {
      const res = await fetch("https://api.api-ninjas.com/v1/quotes", {
        headers: { "X-Api-Key": "+bnOnoRV7hX2FHIobm7bAA==J8IgqUYsZvXSB0go" },
      });

      const data = await res.json();
      data.length > 0
        ? respond(`💡 Tip: "${data[0].quote}"`)
        : respond("Couldn't fetch a tip.");
    } catch {
      respond("❌ Failed to fetch tip.");
    }
  };

  const fetchBotReply = async (text) => {
    try {
      const res = await fetch(
        "https://fin-genie-voice-tracker.onrender.com/api/openai",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        }
      );
      const data = await res.json();
      respond(`🤖 ${data.reply}`);
    } catch (err) {
      respond("🤖 Sorry, I couldn't fetch a reply.");
    }
  };

  // Graph Responses
  const showPieChart = () =>
    respond("📊 Here's your expense category breakdown:", "pie");
  const showBarChart = () => respond("📊 Income vs Expenses Chart:", "bar");
  const showLineChart = () => respond("📈 Income vs Expenses Trend:", "line");

  const parseUserQuery = async (text) => {
    await fetchExpenses();
    await fetchIncome();
    const lower = text.toLowerCase();

    const commands = [
      {
        keywords: ["total income"],
        action: () => respond(`Total income is ₹${getTotalIncome()}`),
      },
      {
        keywords: ["total expenses"],
        action: () => respond(`Total expenses are ₹${getTotalExpenses()}`),
      },
      {
        keywords: ["income last month"],
        action: () =>
          respond(
            `Income last month was ₹${getIncomeByMonth(new Date().getMonth())}`
          ),
      },
      {
        keywords: ["expenses last month"],
        action: () =>
          respond(
            `Expenses last month were ₹${getExpensesByMonth(
              new Date().getMonth()
            )}`
          ),
      },
      {
        keywords: ["income current month"],
        action: () =>
          respond(
            `Income this month is ₹${getIncomeByMonth(
              new Date().getMonth() + 1
            )}`
          ),
      },
      {
        keywords: ["expenses current month"],
        action: () =>
          respond(
            `Expenses this month are ₹${getExpensesByMonth(
              new Date().getMonth() + 1
            )}`
          ),
      },
      { keywords: ["pie chart"], action: showPieChart },
      { keywords: ["bar chart"], action: showBarChart },
      { keywords: ["line chart"], action: showLineChart },
      { keywords: ["tip", "advice", "quotes"], action: fetchFinancialTip },
      { keywords: ["export"], action: exportToPDF },
    ];

    const foundCommand = commands.find((cmd) =>
      cmd.keywords.some((k) => lower.includes(k))
    );
    // foundCommand ? foundCommand.action() : respond("❓ Sorry, I didn't understand that.");

    if (foundCommand) {
      foundCommand.action();
    } else {
      await fetchBotReply(text); // fallback to OpenAI
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    await parseUserQuery(text);
    setInput("");
  };

  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice Recognition is not supported.");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);
    recognition.onresult = (e) => {
      const voiceText = e.results[0][0].transcript;
      handleSend(voiceText);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
  };

  return (
    <div className="fin-genie-container">
      {isOpen && (
        <div className="fingenie-chat-window">
          <div className="fingenie-header">
            <i className="fas fa-user-circle user-icon"></i>
            <span className="chat-title">FinGenie</span>
            <i className="fas fa-robot bot-icon"></i>
          </div>

          <div className="fingenie-body" ref={chatRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`fingenie-msg ${msg.sender}`}>
                <span>{msg.text}</span>

                {msg.showChart === "pie" && (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        dataKey="amount"
                        data={expenses.filter((e) => e.category !== "income")}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {expenses.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS[idx % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {msg.showChart === "bar" && (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={[
                        { name: "Income", amount: getTotalIncome() },
                        { name: "Expenses", amount: getTotalExpenses() },
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {msg.showChart === "line" && (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={[
                        { name: "Income", amount: getTotalIncome() },
                        { name: "Expenses", amount: getTotalExpenses() },
                      ]}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            ))}
          </div>

          <div className="fingenie-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FinGenie something..."
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            />
            <button onClick={() => handleSend(input)}>Send</button>
            <button onClick={handleVoice}>
              {listening ? "🎙️ Listening..." : "🎤 Voice"}
            </button>
          </div>
        </div>
      )}
      <button
        className="fingenie-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖" : "💬"}
      </button>
    </div>
  );
};

export default FinGenie;
