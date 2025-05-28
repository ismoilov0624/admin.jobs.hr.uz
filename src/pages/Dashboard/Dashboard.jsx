"use client";

import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
  const { isAuthenticated, forceAuthCheck } = useAuth();

  useEffect(() => {
    // Force auth check when dashboard loads
    forceAuthCheck();
  }, [forceAuthCheck]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Avtorizatsiya tekshirilmoqda...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Xush kelibsiz, Admin!</p>
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Tizim ma'lumotlari</h3>
        <p>Siz muvaffaqiyatli tizimga kirdingiz.</p>
      </div>
    </div>
  );
};

export default Dashboard;
