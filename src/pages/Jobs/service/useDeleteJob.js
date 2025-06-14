import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const deleteJob = async (jobId) => {
  try {
    const response = await request.delete(`/jobs/${jobId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (data) => {
      // Refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });

      toast.success("Ish o'rni muvaffaqiyatli o'chirildi!", {
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
