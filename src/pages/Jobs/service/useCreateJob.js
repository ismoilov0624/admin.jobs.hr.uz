import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { request } from "../../../config/request";
import Cookies from "js-cookie";

const createJob = async (jobData) => {
  try {
    console.log("=== CREATE JOB DEBUG ===");
    console.log("1. Original job data:", jobData);

    // Check if token exists
    const token = Cookies.get("user_token");
    console.log("2. Token exists:", !!token);
    console.log(
      "3. Token value:",
      token ? `${token.substring(0, 20)}...` : "No token"
    );

    // Ensure all required fields are present and properly formatted
    const formattedData = {
      title: jobData.title,
      salary: Number(jobData.salary),
      type: jobData.type,
      workSchedule: jobData.workSchedule,
      workLocation: jobData.workLocation,
      gender: jobData.gender,
      startDate: jobData.startDate,
      endDate: jobData.endDate,
      description: jobData.description,
      requirements: jobData.requirements,
      responsibilities: jobData.responsibilities,
      conditions: jobData.conditions,
      status: jobData.status || "ACTIVE",
      speciality: jobData.speciality || "",
      department: jobData.department || "",
      position: jobData.position || "",
    };

    console.log("4. Formatted job data:", formattedData);
    console.log("5. Request URL:", request.defaults.baseURL + "/jobs");

    const response = await request.post("/jobs", formattedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("6. Create job response:", response.data);
    console.log("7. Response status:", response.status);
    return response.data;
  } catch (error) {
    console.error("=== CREATE JOB ERROR ===");
    console.error("Error object:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error headers:", error.response?.headers);
    console.error("Request config:", error.config);
    throw error;
  }
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      console.log("=== CREATE JOB SUCCESS ===");
      console.log("Success data:", data);
      // Refetch jobs list
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });

      toast.success("Ish o'rni muvaffaqiyatli yaratildi!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    onError: (error) => {
      console.error("=== CREATE JOB MUTATION ERROR ===");
      console.error("Mutation error:", error);

      let errorMessage = "Noma'lum xatolik yuz berdi";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage =
          "Avtorizatsiya xatosi. Token noto'g'ri yoki muddati tugagan.";
      } else if (error.response?.status === 403) {
        errorMessage = "Sizda ish o'rni yaratish huquqi yo'q.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "Ma'lumotlar noto'g'ri. Iltimos, barcha maydonlarni to'g'ri to'ldiring.";
      } else if (error.response?.status === 422) {
        errorMessage =
          "Validatsiya xatosi. Ba'zi maydonlar noto'g'ri to'ldirilgan.";
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage = "Tarmoq xatosi. Internet ulanishini tekshiring.";
      }

      toast.error("Ish o'rni yaratishda xatolik: " + errorMessage, {
        position: "top-right",
        autoClose: 6000,
      });
    },
  });
};
