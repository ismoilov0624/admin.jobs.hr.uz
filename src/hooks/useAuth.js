"use client";

import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = Cookies.get("user_token");
    const isAuth = !!token;
    setIsAuthenticated(isAuth);
    setIsLoading(false);
    return isAuth;
  }, []);

  useEffect(() => {
    // Check for token on component mount
    checkAuth();

    // Listen for storage changes (when token is set/removed)
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listen for cookie changes
    window.addEventListener("storage", handleStorageChange);

    // Custom event listener for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [checkAuth]);

  const login = useCallback((token, refreshToken) => {
    Cookies.set("user_token", token, { expires: 1 });
    Cookies.set("refresh_token", refreshToken, { expires: 7 });
    setIsAuthenticated(true);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"));
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("user_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"));
    window.location.href = "/login";
  }, []);

  const forceAuthCheck = useCallback(() => {
    return checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    forceAuthCheck,
  };
};
