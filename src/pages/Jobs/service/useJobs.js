import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchJobs = async ({ page = 1, limit = 10, status = "" } = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append("status", status);
    }

    console.log("Fetching admin jobs with params:", { page, limit, status });
    console.log("Request URL:", `/admins/jobs?${params}`);

    const response = await request.get(`/admins/jobs?${params}`);
    console.log("Admin jobs response:", response.data);

    // Ensure we return the correct data structure
    return response.data;
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const useJobs = (filters = {}) => {
  return useQuery({
    queryKey: ["admin-jobs", filters],
    queryFn: () => fetchJobs(filters),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Admin jobs query error:", error);
    },
  });
};
