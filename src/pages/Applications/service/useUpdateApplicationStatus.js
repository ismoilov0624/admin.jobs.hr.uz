import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const updateApplicationStatus = async ({ applicationId, status }) => {
  try {
    const response = await request.patch(
      `/applications/${applicationId}/status`,
      {
        status: status,
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: (data) => {
      // Refetch applications list
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      toast.success("Ariza holati muvaffaqiyatli yangilandi!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      let errorMessage = "Noma'lum xatolik yuz berdi";

      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join(", ");
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.status === 401) {
        errorMessage = "Avtorizatsiya xatosi. Iltimos, qayta kiring.";
      } else if (error.response?.status === 403) {
        errorMessage = "Sizda ariza holatini yangilash huquqi yo'q.";
      } else if (error.response?.status === 404) {
        errorMessage = "Ariza topilmadi.";
      } else if (error.response?.status === 400) {
        errorMessage = "Ma'lumotlar noto'g'ri.";
      }

      toast.error("Ariza holatini yangilashda xatolik: " + errorMessage, {
        position: "top-right",
        autoClose: 6000,
      });
    },
  });
};
