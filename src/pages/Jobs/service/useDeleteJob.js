import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const deleteJob = async (jobId) => {
  try {
    console.log("=== DELETE JOB DEBUG ===");
    console.log("1. Job ID:", jobId);

    const response = await request.delete(`/jobs/${jobId}`);
    console.log("2. Delete job response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== DELETE JOB ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (data) => {
      console.log("Job deleted successfully:", data);
      // Refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });

      toast.success("Ish o'rni muvaffaqiyatli o'chirildi!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Delete job error:", error);

      let errorMessage = "Noma'lum xatolik yuz berdi";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Avtorizatsiya xatosi. Iltimos, qayta kiring.";
      } else if (error.response?.status === 403) {
        errorMessage = "Sizda ish o'rnini o'chirish huquqi yo'q.";
      } else if (error.response?.status === 404) {
        errorMessage = "Ish o'rni topilmadi.";
      }

      toast.error("Ish o'rnini o'chirishda xatolik: " + errorMessage, {
        position: "top-right",
        autoClose: 6000,
      });
    },
  });
};
