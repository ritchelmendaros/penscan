import axios from "axios";

const API_BASE_URL = "https://penscan-api.onrender.com/api";

// Function to get classes by teacher ID
export const getClassesByTeacherId = async (teacherId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/classes/getclassesbyteacherid`, {
      params: { teacherid: teacherId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user classes:", error);
    throw error;
  }
};
