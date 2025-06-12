import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchCandidateDetail = async (candidateId) => {
  try {
    console.log("Fetching candidate detail for ID:", candidateId);

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
    console.log("Candidate detail response:", response.data);

    // Debug user data in the response
    if (response.data?.data) {
      console.log("Candidate detail data:", response.data.data);
      console.log("Candidate fields check:", {
        birthDate: response.data.data?.birthDate,
        gender: response.data.data?.gender,
        region: response.data.data?.region,
        district: response.data.data?.district,
        specialty: response.data.data?.specialty,
        degree: response.data.data?.degree,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching candidate detail:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
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
    onError: (error) => {
      console.error("Candidate detail query error:", error);
    },
  });
};
