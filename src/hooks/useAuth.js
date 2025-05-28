"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("user_token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const logout = () => {
    Cookies.remove("user_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return {
    isAuthenticated,
    isLoading,
    logout,
  };
};
