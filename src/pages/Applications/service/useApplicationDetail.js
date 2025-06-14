import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchApplicationDetail = async (applicationId) => {
  try {
    // Try multiple parameter formats
    const params = new URLSearchParams({
      includeUserDetails: "true",
      expand: "user",
      populate:
        "user.birthDate,user.gender,user.region,user.district,user.specialty,user.degree,user.UserEducation,user.UserExperience,user.UserLanguage",
      fields:
        "user.birthDate,user.gender,user.region,user.district,user.specialty,user.degree",
    });

    const response = await request.get(
      `/applications/${applicationId}?${params}`
    );

    // Debug user data in the response

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useApplicationDetail = (applicationId) => {
  return useQuery({
    queryKey: ["applicationDetail", applicationId],
    queryFn: () => fetchApplicationDetail(applicationId),
    enabled: !!applicationId,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
