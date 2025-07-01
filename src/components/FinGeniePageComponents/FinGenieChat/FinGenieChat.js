import React, { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaUserCircle,
  FaRobot,
  FaTrash,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./FinGenieChat.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CF6",
  "#FF6B6B",
];

const FinGenieChat = ({
  logout,
  expenses,
  totalExpenses,
  incomeList,
  totalIncome,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const chatRef = useRef(null);

  console.log(expenses);
  console.log(totalExpenses);
  console.log(incomeList);
  console.log(totalIncome);

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    if (logout) logout();
    window.location.href = "/login";
  };

  const onSend = (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      handleBotResponse(text.toLowerCase());
    }, 1000);
  };

  const getCurrentMonthYear = () => {
    const d = new Date();
    return [d.getMonth(), d.getFullYear()];
  };

  const getLastMonthYear = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return [d.getMonth(), d.getFullYear()];
  };

  const sumForMonth = (data, monthIndex, year) => {
    return data
      .filter((item) => {
        const date = new Date(item.date);
        return date.getMonth() === monthIndex && date.getFullYear() === year;
      })
      .reduce((acc, item) => acc + Number(item.amount), 0);
  };

  const fetchAIResponse = async (userMessage) => {
    try {
      const messageWithContext = `System: You are a helpful AI financial assistant. For generic greetings like 'hello,' respond with a friendly message or offer assistance with financial queries. User: ${userMessage}`;

      const response = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageWithContext,
        }),
      });

      if (!response.ok) {
        let errorDetails = "";
        try {
          const errorData = await response.json();
          errorDetails = JSON.stringify(errorData, null, 2);
        } catch {
          errorDetails = (await response.text()) || "No response body";
        }
        console.error(
          "API Response Status:",
          response.status,
          response.statusText
        );
        console.error("Response Headers:", [...response.headers.entries()]);
        console.error("Error Details:", errorDetails);
        return `Error: Failed to fetch response from the server (Status: ${response.status} ${response.statusText}). Details: ${errorDetails}`;
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.reply) {
        console.error("Invalid API Response Structure:", data);
        return "Sorry, I didn't get a valid response from the server.";
      }

      return data.reply;
    } catch (err) {
      console.error("API Error:", err.message);
      return "There was a problem fetching a response. Please try again later.";
    }
  };

  // Text-to-Speech function
  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Select first available English voice
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((voice) => voice.lang.includes("en"));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleBotResponse = async (text) => {
    let response = [];

    const [currMonth, currYear] = getCurrentMonthYear();
    const [prevMonth, prevYear] = getLastMonthYear();
    const currentMonthName = new Date(currYear, currMonth).toLocaleString(
      "default",
      { month: "long" }
    );
    const lastMonthName = new Date(prevYear, prevMonth).toLocaleString(
      "default",
      { month: "long" }
    );

    const messageHandlers = [
      {
        check: () => text.match(/\b(hello|hi|hey)\b/i),
        handler: () => [
          {
            sender: "bot",
            text: "Hi! How can I help you with your finances today?",
          },
        ],
      },
      {
        check: () =>
          text.includes("total income") && text.includes("current month"),
        handler: () => {
          const total = sumForMonth(incomeList, currMonth, currYear);
          return [
            {
              sender: "bot",
              text: `Your total income for ${currentMonthName} is ₹${total}.`,
            },
          ];
        },
      },
      {
        check: () =>
          text.includes("total income") && text.includes("last month"),
        handler: () => {
          const total = sumForMonth(incomeList, prevMonth, prevYear);
          return [
            {
              sender: "bot",
              text: `Your total income for ${lastMonthName} was ₹${total}.`,
            },
          ];
        },
      },
      {
        check: () =>
          text.includes("total expenses") && text.includes("current month"),
        handler: () => {
          const total = sumForMonth(expenses, currMonth, currYear);
          return [
            {
              sender: "bot",
              text: `Your total expenses for ${currentMonthName} are ₹${total}.`,
            },
          ];
        },
      },
      {
        check: () =>
          text.includes("total expenses") && text.includes("last month"),
        handler: () => {
          const total = sumForMonth(expenses, prevMonth, prevYear);
          return [
            {
              sender: "bot",
              text: `Your total expenses for ${lastMonthName} were ₹${total}.`,
            },
          ];
        },
      },
      {
        check: () => text.includes("total income"),
        handler: () => [
          {
            sender: "bot",
            text: `Your total income is ₹${totalIncome}. Great going! Keep saving more.`,
          },
        ],
      },
      {
        check: () => text.includes("total expenses"),
        handler: () => [
          {
            sender: "bot",
            text: `Your total expenses are ₹${totalExpenses}. Remember to track regularly!`,
          },
        ],
      },
      {
        check: () => text.includes("income list"),
        handler: () => [
          {
            sender: "bot",
            text: "Here is the tabular view of your income sources:",
          },
          {
            sender: "bot",
            type: "table",
            data: incomeList,
            tableType: "income",
          },
        ],
      },
      {
        check: () => text.includes("expenses"),
        handler: () => [
          { sender: "bot", text: "Here is the tabular view of your expenses:" },
          {
            sender: "bot",
            type: "table",
            data: expenses,
            tableType: "expense",
          },
        ],
      },
      {
        check: () => true,
        handler: async () => {
          const aiText = await fetchAIResponse(text);
          return [{ sender: "bot", text: aiText }];
        },
      },
    ];

    const graphHandlers = [
      {
        check: () =>
          text.includes("income chart") || text.includes("income graph"),
        handler: () => {
          const chartData = incomeList.map((item) => ({
            title: item.title,
            amount: item.amount,
          }));
          return [
            {
              sender: "bot",
              type: "chart",
              chartType: "pie",
              data: chartData,
              title: "Income Distribution",
            },
          ];
        },
      },
      {
        check: () =>
          text.includes("expenses chart") || text.includes("expenses graph"),
        handler: () => {
          const chartData = expenses.map((item) => ({
            category: item.category,
            amount: item.amount,
          }));
          return [
            {
              sender: "bot",
              type: "chart",
              chartType: "bar",
              data: chartData,
              title: "Expenses Overview",
            },
          ];
        },
      },
    ];

    const matched = [...messageHandlers, ...graphHandlers].find((h) =>
      h.check()
    );

    if (matched) {
      const res = await matched.handler();
      setMessages((prev) => [...prev, ...res]);
      if (isSpeechEnabled) {
        res.forEach((msg) => {
          if (
            msg.sender === "bot" &&
            msg.type !== "table" &&
            msg.type !== "chart"
          ) {
            speak(msg.text);
          }
        });
      }
    } else {
      const aiText = await fetchAIResponse(text);
      const botMsg = { sender: "bot", text: aiText };
      setMessages((prev) => [...prev, botMsg]);
      if (isSpeechEnabled) {
        speak(aiText);
      }
    }

    setLoading(false);
  };

  const handleVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setListening(false);
      onSend(transcript);
    };

    recognition.onerror = () => setListening(false);
  };

  const onClearMessages = () => setMessages([]);

  const toggleSpeech = () => {
    setIsSpeechEnabled((prev) => !prev);
    if (isSpeechEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderChart = (msg) => {
    if (!msg.data || msg.data.length === 0) return null;

    if (msg.chartType === "bar") {
      return (
        <div className="chart-wrapper">
          <h4>{msg.title}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={msg.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (msg.chartType === "pie") {
      return (
        <div className="chart-wrapper">
          <h4>{msg.title}</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={msg.data}
                dataKey="amount"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {msg.data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }
    return null;
  };

  const renderTable = (data, type = "") => {
    if (!data.length) return <p>No data available.</p>;

    const headers = {
      income: ["Title", "Amount", "Date"],
      expense: ["Category", "Title", "Amount", "Date"],
    };

    const fields = {
      income: ["title", "amount", "date"],
      expense: ["category", "title", "amount", "date"],
    };

    return (
      <table className="data-table">
        <thead>
          <tr>
            {headers[type].map((head, i) => (
              <th key={i}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx}>
              {fields[type].map((key, i) => (
                <td key={i}>
                  {key === "date"
                    ? new Date(entry[key]).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : entry[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const navItems = ["Chat", "Profile", "Menu", "Logout"];

  return (
    <div
      className="fin-genie-chat-container"
      style={{ display: "flex", height: "100%" }}
    >
      <aside className="sidebar-ai">
        <h2 className="sidebar-ai-title">FinGenie</h2>
        <ul className="sidebar-ai-nav">
          {navItems.map((label) => (
            <li key={label}>
              <div
                className="sidebar-ai-link"
                onClick={() => label === "Logout" && handleLogout()}
              >
                {label}
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <div className="fin-chat-box">
        <div className="fin-chat-header">
          <div className="header-left">
            <FaRobot className="header-icon" /> AI Assistant
          </div>
          <div className="header-right">
            <button
              className="speech-toggle-btn"
              onClick={toggleSpeech}
              title={
                isSpeechEnabled ? "Disable Auto-Speech" : "Enable Auto-Speech"
              }
            >
              {isSpeechEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
            <button className="clear-chat-btn" onClick={onClearMessages}>
              <FaTrash />
            </button>
          </div>
        </div>

        <div className="fin-chat-body">
          {messages.map((msg, i) => (
            <div key={i} className={`fin-msg ${msg.sender}`}>
              <div className="msg-bubble">
                <span className="msg-icon">
                  {msg.sender === "user" ? <FaUserCircle /> : <FaRobot />}
                </span>
                <span className="msg-text">
                  {msg.type === "table"
                    ? renderTable(msg.data, msg.tableType)
                    : msg.text}
                </span>
                {msg.sender === "bot" &&
                  msg.type !== "table" &&
                  msg.type !== "chart" && (
                    <button
                      className="msg-speak-btn"
                      onClick={() => speak(msg.text)}
                      title="Speak this message"
                    >
                      <FaVolumeUp />
                    </button>
                  )}
              </div>
              {msg.type === "chart" && renderChart(msg)}
            </div>
          ))}

          {loading && (
            <div className="fin-msg bot typing">
              <span>Typing</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          )}

          <div ref={chatRef}></div>
        </div>

        <div className="fin-chat-input-wrapper">
          <div className="voice-top-btn">
            <button className="voice-btn" onClick={handleVoice}>
              {listening ? "🎙️ Listening..." : <FaMicrophone />}
            </button>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend(input);
              }}
            />
            <button className="send-btn" onClick={() => onSend(input)}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinGenieChat;
