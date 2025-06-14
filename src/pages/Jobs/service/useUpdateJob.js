import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const updateJob = async ({ jobId, jobData }) => {
  try {
    // Check if jobData is FormData (for file uploads) or regular object
    const isFormData = jobData instanceof FormData;

    const config = isFormData
      ? {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      : {};

    if (isFormData) {
      for (const [key, value] of jobData.entries()) {
      }
    } else {
      // Ensure salary is always a string for regular object
      if (jobData.salary !== undefined && jobData.salary !== null) {
        jobData.salary = String(jobData.salary).trim();
      }
    }

    const response = await request.patch(`/jobs/${jobId}`, jobData, config);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: (data) => {
      // Refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });

      toast.success("Ish o'rni muvaffaqiyatli yangilandi!", {
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
        errorMessage = "Sizda ish o'rnini yangilash huquqi yo'q.";
      } else if (error.response?.status === 404) {
        errorMessage = "Ish o'rni topilmadi.";
      } else if (error.response?.status === 400) {
        errorMessage = "Ma'lumotlar noto'g'ri.";
      }

      toast.error("Ish o'rnini yangilashda xatolik: " + errorMessage, {
        position: "top-right",
        autoClose: 6000,
      });
    },
  });
};
