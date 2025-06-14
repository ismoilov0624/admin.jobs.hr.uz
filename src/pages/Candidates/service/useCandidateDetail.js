import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchCandidateDetail = async (candidateId) => {
  try {
    // Try multiple parameter formats
    const params = new URLSearchParams({
      includeDetails: "true",
      expand: "all",
      populate:
        "birthDate,gender,region,district,specialty,degree,UserEducation,UserExperience,UserLanguage",
      fields:
        "id,avatar,firstName,lastName,status,specialty,birthDate,gender,region,district,degree,createdAt,updatedAt",
    });

    const response = await request.get(`/users/${candidateId}?${params}`);

    // Debug user data in the response
    if (response.data?.data) {
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useCandidateDetail = (candidateId) => {
  return useQuery({
    queryKey: ["candidateDetail", candidateId],
    queryFn: () => fetchCandidateDetail(candidateId),
    enabled: !!candidateId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
