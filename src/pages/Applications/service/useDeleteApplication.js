import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const deleteApplication = async (applicationId) => {
  try {
    const response = await request.delete(`/applications/${applicationId}`);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: (data) => {
      // Refetch applications list
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      toast.success("Ariza muvaffaqiyatli o'chirildi!", {
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
        errorMessage = "Sizda arizani o'chirish huquqi yo'q.";
      } else if (error.response?.status === 404) {
        errorMessage = "Ariza topilmadi.";
      }

      toast.error("Arizani o'chirishda xatolik: " + errorMessage, {
        position: "top-right",
        autoClose: 6000,
      });
    },
  });
};
