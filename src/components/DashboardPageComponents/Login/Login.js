import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";
import { FaMicrophone } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      if (user) {
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-main">
      <div className="project-title-container">
        <h1 className="project-title">AI-Powered Finance Assistant</h1>
      </div>
      <div className="login-page-container">
        <h2 className="login-title">Login</h2>
        <div className="login-form-wrapper">
          <form onSubmit={handleLogin} className="login-page-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
              disabled={loading}
            />
            {error && <div className="error-message shake">{error}</div>}
            <button type="submit" disabled={loading} className="login-button">
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
        <p className="login-page-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
          <span className="voice-hint">
            <FaMicrophone /> Voice-activated finance awaits!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;