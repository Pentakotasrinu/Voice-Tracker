import React, { useState, useEffect, useRef } from "react";
import "./VoiceInputButton.css";

const VoiceInputButton = ({
  email,
  setIncomeList,
  setTotalIncome,
  setExpenses,
  setTotalExpenses,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversationState, setConversationState] = useState(null);
  const [tempData, setTempData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [awaitingWakeWord, setAwaitingWakeWord] = useState(true);
  const recognitionRef = useRef(null);
  const shouldStop = useRef(false);
  const conversationStateRef = useRef(null);
  const tempDataRef = useRef({});

  const updateConversationState = (newState) => {
    setConversationState(newState);
    conversationStateRef.current = newState;
  };

  const updateTempData = (newData) => {
    const updated = { ...tempDataRef.current, ...newData };
    setTempData(updated);
    tempDataRef.current = updated;
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      speak("Sorry, your browser does not support voice recognition.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;

    recog.onresult = async (event) => {
      const voiceText = event.results[0][0].transcript.toLowerCase().trim();
      console.log("🗣️ Voice input received:", voiceText);
      setTranscript(`🎙️ You said: "${voiceText}"`);
      await handleConversation(voiceText);
    };

    recog.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setTranscript("⚠️ Voice recognition error.");
      speak("I couldn't hear you clearly. Try again.");
      stopRecording();
    };

    recog.onend = () => {
      if (!shouldStop.current && isRecording) {
        recognitionRef.current.start();
      }
    };

    recognitionRef.current = recog;
  }, []);

  const speak = (text, callback) => {
    speechSynthesis.cancel();
    recognitionRef.current?.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => {
      if (!shouldStop.current) callback?.();
    };
    speechSynthesis.speak(utterance);
  };

  const startRecording = () => {
    try {
      shouldStop.current = false;
      recognitionRef.current?.start();
      setIsRecording(true);
      setTranscript("🎤 Listening...");
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  const stopRecording = () => {
    shouldStop.current = true;
    recognitionRef.current?.stop();
    setIsRecording(false);
    setTranscript("🛑 Recording stopped.");
  };

  const parseDate = (input) => {
    const currentYear = new Date().getFullYear();
    const parsedDate = new Date(`${input} ${currentYear}`);

    if (isNaN(parsedDate)) return null;

    // Adjust for timezone shift by setting the time to midnight
    parsedDate.setMinutes(
      parsedDate.getMinutes() - parsedDate.getTimezoneOffset()
    );

    return parsedDate.toISOString().split("T")[0];
  };

  const resetConversation = () => {
    updateConversationState(null);
    setTempData({});
    tempDataRef.current = {};
    stopRecording();
  };

  const handleConversation = async (text) => {
    console.log("State:", conversationStateRef.current);
    console.log("Temp:", tempDataRef.current);

    if (conversationStateRef.current === "incomeTitle") {
      if (!text.trim())
        return speak(
          "Please provide a valid title for the income.",
          startRecording
        );
      updateTempData({ title: text });
      updateConversationState("incomeDate");
      return speak("What is the date for this income?", startRecording);
    }

    if (conversationStateRef.current === "incomeDate") {
      const date = parseDate(text);
      if (!date) return speak("Say a valid date like April 10", startRecording);

      const { title, amount } = tempDataRef.current;
      if (!title || !amount || !email)
        return speak(
          "Some data is missing. Please try again.",
          resetConversation
        );

      const payload = {
        email,
        title,
        date,
        amount: parseInt(amount),
      };

      console.log("📤 Sending income:", payload);

      try {
        const res = await fetch("http://localhost:5000/api/income/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");

        speak("✅ Income added successfully.");
        setPopupMessage("✅ Income added successfully!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000); // hides popup after 3s
        setIncomeList((prev) => [...prev, data.income]);
        setTotalIncome((prev) => prev + payload.amount);
      } catch (err) {
        console.error("Income error:", err);
        speak("Failed to add income.");
      }

      resetConversation();
      return;
    }

    if (conversationStateRef.current === "expenseCategory") {
      if (!text.trim())
        return speak("Please say a valid category.", startRecording);
      updateTempData({ category: text });
      updateConversationState("expenseTitle");
      return speak("What is the title for this expense?", startRecording);
    }

    if (conversationStateRef.current === "expenseTitle") {
      if (!text.trim())
        return speak("Please provide a valid title.", startRecording);
      updateTempData({ title: text });
      updateConversationState("expenseDate");
      return speak("What is the date for this expense?", startRecording);
    }

    if (conversationStateRef.current === "expenseDate") {
      const date = parseDate(text);
      if (!date) return speak("Say a valid date like April 10", startRecording);

      const { title, amount, category } = tempDataRef.current;
      if (!title || !amount || !email || !category)
        return speak("Missing data. Try again.", resetConversation);

      // Clean title and category
      const cleanedTitle = title.replace(/\.$/, ""); // Removes trailing dot
      const cleanedCategory = category.replace(/\.$/, ""); // Removes trailing dot

      const payload = {
        email,
        title: cleanedTitle,
        date,
        category: cleanedCategory,
        amount: parseInt(amount),
      };

      console.log("📤 Sending expense:", payload);

      try {
        const res = await fetch("http://localhost:5000/api/expenses/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed");

        speak("💸 Expense added successfully.");
        setPopupMessage("💸 Expense added successfully!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 4000);
        setExpenses((prev) => [...prev, data.expense]);
        setTotalExpenses((prev) => prev + payload.amount);
      } catch (err) {
        console.error("Expense error:", err);
        speak("Failed to add expense.");
      }

      resetConversation();
      return;
    }

    // ===== First Input Parser =====
    const amountMatch = text.match(/(?:income|expense)[^\d]*(\d[\d,]*)/i);
    const type = text.includes("income")
      ? "income"
      : text.includes("expense")
      ? "expense"
      : null;

    if (type && amountMatch) {
      const amount = parseInt(amountMatch[1].replace(/,/g, ""));
      updateTempData({ type, amount, email });

      if (type === "income") {
        updateConversationState("incomeTitle");
        return speak("What's the title for this income?", startRecording);
      } else {
        updateConversationState("expenseCategory");
        return speak("What category is this expense for?", startRecording);
      }
    }

    speak(
      "Say something like 'add income of 5000' or 'add expense of 1000'",
      startRecording
    );
  };

  return (
    <div className="voice-input-container">
      <div className="instructions-container">
        <h2>How to use Voice Input</h2>
        <p>Speak to add your income or expenses.</p>
        <ol>
          <li>Click "Talk to FinGenie"</li>
          <li>Say the amount and type</li>
          <li>Answer follow-up questions</li>
        </ol>
      </div>

      <div className="voice-button-container">
        <button
          onClick={startRecording}
          className={`voice-input-button ${isRecording ? "recording" : ""}`}
          disabled={isRecording}
        >
          {isRecording ? "🎙️ Listening..." : "🗣️ Talk to FinGenie"}
        </button>
        <button
          onClick={stopRecording}
          className="stop-button"
          disabled={!isRecording}
        >
          ❌ Stop
        </button>
      </div>

      <p className="voice-transcript">{transcript}</p>

      {showPopup && <div className="popup">{popupMessage}</div>}
    </div>
  );
};

export default VoiceInputButton;
