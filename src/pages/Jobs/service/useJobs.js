import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchJobs = async ({
  page = 1,
  limit = 10,
  search = "",
  location = "",
  minSalary = "",
  maxSalary = "",
  startDate = "",
  endDate = "",
  type = "",
  status = "",
  workLocation = "",
  gender = "",
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    if (location) {
      params.append("location", location);
    }

    if (minSalary) {
      params.append("minSalary", minSalary);
    }

    if (maxSalary) {
      params.append("maxSalary", maxSalary);
    }

    if (startDate) {
      params.append("startDate", startDate);
    }

    if (endDate) {
      params.append("endDate", endDate);
    }

    if (type) {
      params.append("type", type);
    }

    if (status) {
      params.append("status", status);
    }

    if (workLocation) {
      params.append("workLocation", workLocation);
    }

    if (gender) {
      params.append("gender", gender);
    }

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    if (sortOrder) {
      params.append("sortOrder", sortOrder);
    }

    console.log("Fetching jobs with params:", {
      page,
      limit,
      search,
      location,
      minSalary,
      maxSalary,
      startDate,
      endDate,
      type,
      status,
      workLocation,
      gender,
      sortBy,
      sortOrder,
    });
    console.log("Request URL:", `/jobs?${params}`);

    const response = await request.get(`admins/jobs?${params}`);
    console.log("Jobs response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
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
      console.error("Jobs query error:", error);
    },
  });
};
