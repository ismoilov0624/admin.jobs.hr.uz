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

    console.log("Fetching candidates with params:", {
      page,
      limit,
      search,
      status,
      specialty,
      gender,
      region,
      district,
      degree,
      birthDateFrom,
      birthDateTo,
      sortBy,
      sortOrder,
    });
    console.log("Request URL:", `/users?${params}`);

    const response = await request.get(`/users?${params}`);
    console.log("Candidates response:", response.data);

    // Debug user data in the response
    if (response.data?.data?.users?.length > 0) {
      console.log("First candidate data:", response.data.data.users[0]);
      console.log("Candidate fields check:", {
        birthDate: response.data.data.users[0]?.birthDate,
        gender: response.data.data.users[0]?.gender,
        region: response.data.data.users[0]?.region,
        district: response.data.data.users[0]?.district,
        specialty: response.data.data.users[0]?.specialty,
        degree: response.data.data.users[0]?.degree,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const useCandidates = (filters = {}) => {
  return useQuery({
    queryKey: ["candidates", filters],
    queryFn: () => fetchCandidates(filters),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Candidates query error:", error);
    },
  });
};
