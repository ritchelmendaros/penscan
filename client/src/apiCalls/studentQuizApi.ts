import axios from "axios";
import { toast } from "react-toastify";

// const BASE_URL = 'https://penscan-api.onrender.com/api/studentquiz';
const BASE_URL = "http://localhost:8080/api/studentquiz";

export const uploadStudentQuiz = async (quizid: string, selectedFile: File) => {
  const formData = new FormData();
  formData.append("quizid", quizid);
  formData.append("image", selectedFile);

  try {
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || "An error occurred";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const saveStudentQuiz = async (
  studentQuizId: string,
  newText: string,
  comment: string,
  bonusScore: number,
  editedStatus: string
) => {
  try {
    const response = await axios.put(`${BASE_URL}/edit`, {
      studentQuizId,
      newText,
      comment,
      bonusScore,
      editedStatus,
    });
    toast.success(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || "Error saving changes";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred while saving changes");
    }
    throw error;
  }
};
