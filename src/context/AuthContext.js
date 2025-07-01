import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  useEffect(() => {
    // Whenever user changes, update localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]); // ✅ Keeps localStorage in sync with AuthContext

  // Function to login user
  // const login = async (email, password) => {
  //   try {
  //     const response = await fetch("https://localhost:5000/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();
  //     if (response.ok) {
  //       setUser(data.user); // ✅ Set user state
  //       return data.message;
  //     } else {
  //       throw new Error(data.message || "Login failed");
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     throw error;
  //   }
  // };
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        return data.user; // ✅ Return user object
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Function to logout user
  const logout = () => {
    setUser(null); // ✅ Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
