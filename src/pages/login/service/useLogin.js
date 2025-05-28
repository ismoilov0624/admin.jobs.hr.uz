import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const loginAdmin = async (credentials) => {
  const response = await request.post("/auth/admin/login", credentials);
  return response.data;
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      // Save tokens to cookies
      Cookies.set("user_token", data.data.accessToken, { expires: 1 });
      Cookies.set("refresh_token", data.data.refreshToken, { expires: 7 });

      toast.success("Muvaffaqiyatli kirildi!", {
        position: "top-right",
      });

      // Force page reload to update auth state
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
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
