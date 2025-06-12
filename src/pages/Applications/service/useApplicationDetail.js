import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

const fetchApplicationDetail = async (applicationId) => {
  try {
    console.log("Fetching application detail for ID:", applicationId);

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
    console.log("Application detail response:", response.data);

    // Debug user data in the response
    if (response.data?.data?.application?.user) {
      console.log(
        "Application detail user data:",
        response.data.data.application.user
      );
      console.log("User fields check:", {
        birthDate: response.data.data.application.user?.birthDate,
        gender: response.data.data.application.user?.gender,
        region: response.data.data.application.user?.region,
        district: response.data.data.application.user?.district,
        specialty: response.data.data.application.user?.specialty,
        degree: response.data.data.application.user?.degree,
      });
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching application detail:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
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
    onError: (error) => {
      console.error("Application detail query error:", error);
    },
  });
};
