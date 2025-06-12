import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";

const updateJob = async ({ jobId, jobData }) => {
  try {
    console.log("=== UPDATE JOB DEBUG ===");
    console.log("1. Job ID:", jobId);
    console.log("2. Job data:", jobData);

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
      console.log("3. FormData entries:");
      for (const [key, value] of jobData.entries()) {
        console.log(`${key}:`, value);
      }
    } else {
      // Ensure salary is always a string for regular object
      if (jobData.salary !== undefined && jobData.salary !== null) {
        jobData.salary = String(jobData.salary).trim();
      }
      console.log("3. Job data after salary conversion:", jobData);
    }

    const response = await request.patch(`/jobs/${jobId}`, jobData, config);
    console.log("4. Update job response:", response.data);
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
