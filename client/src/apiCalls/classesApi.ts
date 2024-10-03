import axiosInstance from "./common/axiosInstance";

// Function to get classes by teacher ID
export const getClassesByTeacherId = async (teacherId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/classes/getclassesbyteacherid`,
      {
        params: { teacherid: teacherId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user classes:", error);
    throw error;
  }
};
