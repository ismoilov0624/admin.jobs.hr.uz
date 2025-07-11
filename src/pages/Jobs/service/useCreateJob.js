import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const createJob = async (jobData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Append all job fields to FormData
    Object.keys(jobData).forEach((key) => {
      if (
        jobData[key] !== undefined &&
        jobData[key] !== null &&
        jobData[key] !== ""
      ) {
        if (key === "avatar" && jobData[key] instanceof File) {
          formData.append(key, jobData[key]);
        } else {
          formData.append(key, String(jobData[key]));
        }
      }
    });

    for (let [key, value] of formData.entries()) {
    }

    const response = await request.post("/jobs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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
