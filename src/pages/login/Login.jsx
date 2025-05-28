"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useLogin } from "./service/useLogin";
import "./Login.scss";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <img src="/src/assets/logo.png" alt="Jobs Logo" />
          </div>
          <h1>Tizimga kirish</h1>
          <p>Admin hisobingizga kiring</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Foydalanuvchi nomi</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                id="username"
                type="text"
                placeholder="Foydalanuvchi nomini kiriting"
                {...register("username", {
                  required: "Foydalanuvchi nomi majburiy",
                })}
                className={errors.username ? "error" : ""}
              />
            </div>
            {errors.username && (
              <span className="error-message">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Parol</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Parolni kiriting"
                {...register("password", {
                  required: "Parol majburiy",
                })}
                className={errors.password ? "error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="login-button" disabled={isPending}>
            {isPending ? "Kirish..." : "Kirish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
