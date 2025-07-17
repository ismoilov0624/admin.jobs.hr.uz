import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const createJob = async (jobData) => {
  try {
    // FormData yaratish
    const formData = new FormData();

    // Barcha fieldlarni FormData ga qo'shish
    Object.keys(jobData).forEach((key) => {
      if (
        jobData[key] !== undefined &&
        jobData[key] !== null &&
        jobData[key] !== ""
      ) {
        if (key === "avatar" && jobData[key] instanceof File) {
          // Fayl obyektini qo'shish
          formData.append("avatar", jobData[key]);
        } else if (key === "avatarFilename") {
          // Avatar filename ni alohida field sifatida qo'shish
          formData.append("avatarFilename", jobData[key]);
        } else if (key !== "avatar") {
          // Boshqa fieldlar
          formData.append(key, String(jobData[key]));
        }
      }
    });

    // Agar fayl yo'q bo'lsa, default avatar filename qo'shamiz
    if (!jobData.avatar || !(jobData.avatar instanceof File)) {
      formData.append("avatarFilename", "no-avatar-default.jpg");
    }

    // FormData contents ni tekshirish

    for (const [key, value] of formData.entries()) {
      if (key === "avatar" && value instanceof File) {
      } else {
      }
    }

    // FormData bilan jo'natish
    const response = await request.post("/jobs", formData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      // Refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });

      toast.success("Ish o'rni muvaffaqiyatli yaratildi!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      let errorMessage = "Noma'lum xatolik yuz berdi";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Avtorizatsiya xatosi. Iltimos, qayta kiring.";
      } else if (error.response?.status === 403) {
        errorMessage = "Sizda ish o'rni yaratish huquqi yo'q.";
      } else if (error.response?.status === 400) {
        errorMessage = "Ma'lumotlar noto'g'ri yoki to'liq emas.";
      }

      toast.error("Ish o'rnini yaratishda xatolik: " + errorMessage, {
        position: "top-right",
        autoClose: 6000,
      });
    },
  });
};
