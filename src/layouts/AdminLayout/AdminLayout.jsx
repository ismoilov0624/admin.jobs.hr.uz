"use client";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  UserCheck,
  LogOut,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo.png";
import "./AdminLayout.scss";

const AdminLayout = () => {
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If not authenticated, don't render the layout
  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      path: "/jobs",
      icon: Briefcase,
      label: "Bo'sh ish o'rinlari",
    },
    {
      path: "/applications",
      icon: FileText,
      label: "Arizalar",
    },
    {
      path: "/candidates",
      icon: UserCheck,
      label: "Nomzodlar",
    },
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname
    );
    return currentItem?.label || "Dashboard";
  };

  const handleLogout = () => {
    logout();

    toast.success("Tizimdan muvaffaqiyatli chiqdingiz!", {
      position: "top-right",
      autoClose: 2000,
    });

    // Navigate to login page using React Router
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };

  const handleUserProfileClick = () => {
    handleLogout();
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <img src={logo} alt="Jobs Logo" />
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <div className="user-profile" onClick={handleUserProfileClick}>
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">Administrator</span>
              </div>
              <LogOut size={16} className="logout-icon" />
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
