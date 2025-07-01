import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import "./Signup.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateName(name)) {
      setError("Name must be at least 2 characters long");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        alert("Account created successfully!");
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-main">
      <div className="project-title-container">
        <h1 className="project-title">AI-Powered Finance Assistant</h1>
      </div>
      <div className="signup-page-container">
        <h2 className="signup-title">Sign Up</h2>
        <div className="signup-form-wrapper">
          <form onSubmit={handleSignup} className="signup-page-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="signup-input"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
              disabled={loading}
            />
            {error && <div className="error-message shake">{error}</div>}
            <button type="submit" disabled={loading} className="signup-button">
              {loading ? <span className="loading-spinner"></span> : "Sign Up"}
            </button>
          </form>
        </div>
        <p className="signup-page-footer">
          Already have an account? <Link to="/login">Login</Link>
          <span className="voice-hint">
            <FaMicrophone /> Voice-activated finance awaits!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
