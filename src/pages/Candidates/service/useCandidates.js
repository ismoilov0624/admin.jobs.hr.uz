import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchCandidates = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  specialty = "",
  gender = "",
  region = "",
  district = "",
  degree = "",
  birthDateFrom = "",
  birthDateTo = "",
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      // Try different parameter formats
      includeDetails: "true",
      expand: "all",
      populate: "birthDate,gender,region,district,specialty,degree",
      fields:
        "id,avatar,firstName,lastName,status,specialty,birthDate,gender,region,district,degree,createdAt,updatedAt",
    });

    if (search) {
      params.append("search", search);
    }

    if (status) {
      params.append("status", status);
    }

    if (specialty) {
      params.append("specialty", specialty);
    }

    if (gender) {
      params.append("gender", gender);
    }

    if (region) {
      params.append("region", region);
    }

    if (district) {
      params.append("district", district);
    }

    if (degree) {
      params.append("degree", degree);
    }

    if (birthDateFrom) {
      params.append("birthDateFrom", birthDateFrom);
    }

    if (birthDateTo) {
      params.append("birthDateTo", birthDateTo);
    }

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    if (sortOrder) {
      params.append("sortOrder", sortOrder);
    }

    const response = await request.get(`/users?${params}`);

    // Debug user data in the response

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useCandidates = (filters = {}) => {
  return useQuery({
    queryKey: ["candidates", filters],
    queryFn: () => fetchCandidates(filters),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
