import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const updateApplicationStatus = async ({ applicationId, status }) => {
  try {
    console.log("=== UPDATE APPLICATION STATUS DEBUG ===");
    console.log("1. Application ID:", applicationId);
    console.log("2. New status:", status);

    const response = await request.patch(
      `/applications/${applicationId}/status`,
      {
        status: status,
      }
    );
    console.log("3. Update application status response:", response.data);
    return response.data;
  } catch (error) {
    console.error("=== UPDATE APPLICATION STATUS ERROR ===");
    console.error("Error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplicationStatus,
    onSuccess: (data) => {
      console.log("Application status updated successfully:", data);
      // Refetch applications list
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      toast.success("Ariza holati muvaffaqiyatli yangilandi!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("Update application status error:", error);

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
