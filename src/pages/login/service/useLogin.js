"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const loginAdmin = async (credentials) => {
  const response = await request.post("/auth/admin/login", credentials);
  return response.data;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      console.log("Login successful:", data);

      // Use the login function from useAuth hook
      login(data.data.accessToken, data.data.refreshToken);

      toast.success("Muvaffaqiyatli kirildi!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Use React Router navigation instead of window.location
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
    },
    onError: (error) => {
      console.error("Login error:", error);

      let errorMessage = "Login xatosi yuz berdi";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Noto'g'ri foydalanuvchi nomi yoki parol";
      } else if (error.response?.status === 403) {
        errorMessage = "Sizda tizimga kirish huquqi yo'q";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 6000,
      });
    },
  });
};
