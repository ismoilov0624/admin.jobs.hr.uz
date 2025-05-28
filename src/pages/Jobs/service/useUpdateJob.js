import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const updateJob = async ({ jobId, jobData }) => {
  try {
    console.log("=== UPDATE JOB DEBUG ===");
    console.log("1. Job ID:", jobId);
    console.log("2. Job data:", jobData);

    const response = await request.patch(`/jobs/${jobId}`, jobData);
    console.log("3. Update job response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== UPDATE JOB ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: (data) => {
      console.log("Job updated successfully:", data);
      // Refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });

      toast.success("Ish o'rni muvaffaqiyatli yangilandi!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Update job error:", error);

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
