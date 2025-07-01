import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { FaMicrophone } from "react-icons/fa";
import "./Navbar.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false); // Track mobile profile state
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const profileRef = useRef(null);

  // Close dropdown when clicking or tapping outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setIsMobileProfileOpen(false); // Close mobile profile menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen && showProfileMenu) {
      setShowProfileMenu(false); // Close profile menu when hamburger closes
      setIsMobileProfileOpen(false);
    }
  };

  // Toggle profile menu with mobile context
  const toggleProfileMenu = () => {
    if (window.innerWidth <= 768) {
      setIsMobileProfileOpen(!isMobileProfileOpen);
      setShowProfileMenu(!isMobileProfileOpen); // Sync with mobile state
    } else {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  // Extract initials from email
  const getInitialsFromEmail = (email) => {
    if (!email) return "U";
    const emailPrefix = email.split("@")[0];
    return emailPrefix
      .split(/[.\-_]/)
      .map(word => word[0]?.toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
      <div className="navbar-logo logo-container">
        <img
          src="https://public.readdy.ai/ai/img_res/1b03e6710cfd83667291e0c20c071a08.jpg"
          alt="FinGenie Logo"
          className="logo-img"
        />
        <span className="logo-text">FinGenie</span>
      </div>
      <button className="hamburger" onClick={toggleMenu}>
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
      <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <button className="navbar-button glow-button" onClick={() => navigate("/")}>Dashboard</button>
        <button className="navbar-button glow-button" onClick={() => navigate("/expenses")}>Database</button>
        <button className="navbar-button glow-button" onClick={() => navigate("/fingenie")}>
          FinGenie
          <span className="voice-hint voice-pulse" title="Voice-activated financial insights">
            <FaMicrophone />
          </span>
        </button>
        <button className="navbar-button glow-button" onClick={() => navigate("/settings")}>Settings</button>

        {user ? (
          <div className="profile-container" ref={profileRef}>
            <button
              onClick={toggleProfileMenu}
              className="profile-button glow-button"
              aria-haspopup="true"
              aria-expanded={showProfileMenu ? "true" : "false"}
            >
              <i className="fas fa-user"></i> {getInitialsFromEmail(user.email)}
            </button>

            {(showProfileMenu || isMobileProfileOpen) && (
              <div className="profile-menu">
                <p className="user-email">{user.email}</p>
                <button className="menu-button" onClick={() => navigate("/profile")}>Profile Settings</button>
                <button className="menu-button" onClick={() => navigate("/preferences")}>Preferences</button>
                <button
                  className="menu-button"
                  onClick={() => {
                    logout();
                    navigate("/login");
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="navbar-button login-button glow-button" onClick={() => navigate("/login")}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;