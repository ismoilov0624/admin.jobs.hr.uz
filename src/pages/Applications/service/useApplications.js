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

    const response = await request.get(`/applications/admin?${params}`);

    // Debug user data in the response

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useApplications = (filters = {}) => {
  return useQuery({
    queryKey: ["applications", filters],
    queryFn: () => fetchApplications(filters),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
