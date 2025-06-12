import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchApplications = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
  startDate = "",
  endDate = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  // Job filters
  jobTitle = "",
  organizationId = "",
  // User filters
  gender = "",
  region = "",
  district = "",
  specialty = "",
  degree = "",
  birthDateFrom = "",
  birthDateTo = "",
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      // Try different include parameter formats
      includeUserDetails: "true",
      expand: "user",
      populate:
        "user.birthDate,user.gender,user.region,user.district,user.specialty,user.degree",
    });

    if (search) {
      params.append("search", search);
    }

    if (status) {
      params.append("status", status);
    }

    if (startDate) {
      params.append("startDate", startDate);
    }

    if (endDate) {
      params.append("endDate", endDate);
    }

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    if (sortOrder) {
      params.append("sortOrder", sortOrder);
    }

    // Job filters
    if (jobTitle) {
      params.append("jobTitle", jobTitle);
    }

    if (organizationId) {
      params.append("organizationId", organizationId);
    }

    // User filters
    if (gender) {
      params.append("userGender", gender);
    }

    if (region) {
      params.append("userRegion", region);
    }

    if (district) {
      params.append("userDistrict", district);
    }

    if (specialty) {
      params.append("userSpecialty", specialty);
    }

    if (degree) {
      params.append("userDegree", degree);
    }

    if (birthDateFrom) {
      params.append("userBirthDateFrom", birthDateFrom);
    }

    if (birthDateTo) {
      params.append("userBirthDateTo", birthDateTo);
    }

    console.log("Fetching applications with params:", {
      page,
      limit,
      search,
      status,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      jobTitle,
      organizationId,
      gender,
      region,
      district,
      specialty,
      degree,
      birthDateFrom,
      birthDateTo,
    });
    console.log("Request URL:", `/applications/admin?${params}`);

    const response = await request.get(`/applications/admin?${params}`);
    console.log("Applications response:", response.data);

    // Debug user data in the response
    if (response.data?.data?.applications?.length > 0) {
      console.log(
        "First application user data:",
        response.data.data.applications[0].user
      );
      console.log("User fields check:", {
        birthDate: response.data.data.applications[0].user?.birthDate,
        gender: response.data.data.applications[0].user?.gender,
        region: response.data.data.applications[0].user?.region,
        district: response.data.data.applications[0].user?.district,
        specialty: response.data.data.applications[0].user?.specialty,
        degree: response.data.data.applications[0].user?.degree,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching applications:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const useApplications = (filters = {}) => {
  return useQuery({
    queryKey: ["applications", filters],
    queryFn: () => fetchApplications(filters),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error("Applications query error:", error);
    },
  });
};
