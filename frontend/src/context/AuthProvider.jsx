import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on init
    const data = localStorage.getItem("auth_user");
    if (data) setUser(JSON.parse(data));
  }, []);

  function login(payload) {
    setUser(payload);
    localStorage.setItem("auth_user", JSON.stringify(payload));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token"); // In case token is stored separately
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
