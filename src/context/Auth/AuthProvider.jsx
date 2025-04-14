import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("session");
    setIsLoggedIn(!!session);
  }, []);

  const login = (sessionData) => {
    localStorage.setItem("session", sessionData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("session");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
