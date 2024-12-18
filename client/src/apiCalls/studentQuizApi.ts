import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./common/axiosInstance";

// const BASE_URL = 'https://penscan-server.onrender.com/api/studentquiz';
// // const BASE_URL = "http://localhost:8080/api/studentquiz";

export const uploadStudentQuiz = async (quizid: string, selectedFile: File) => {
  const formData = new FormData();
  formData.append("quizid", quizid);
  formData.append("image", selectedFile);

  try {
    const response = await axiosInstance.post(
      '/api/studentquiz/upload', 
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(response.data);
    return response.data;

  } catch (error) {

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data[" "] || "An error occurred";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const studentuploadStudentQuiz = async (quizid: string, userid: string, selectedFile: File) => {
  const formData = new FormData();
  formData.append("quizid", quizid);
  formData.append("userid", userid);
  formData.append("image", selectedFile);

  try {
    const response = await axiosInstance.post(
      '/api/studentquiz/studentupload', 
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data[" "] || "Rate limit exceed. Please retry after a couple of seconds.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const saveStudentQuiz = async (
  studentQuizId: string,
  userId: string,
  newText: string,
  comment: string,
  bonusScore: number,
  editedStatus: string
) => {
  try {
    const response = await axiosInstance.put(
      '/api/studentquiz/edit', 
      {
        studentQuizId,
        userId,
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

export const studentsaveStudentQuiz = async (
  studentQuizId: string,
  userId: string,
  newText: string,
  editedStatus: string
) => {
  try {
    const response = await axiosInstance.put(
      '/api/studentquiz/studentedit', 
      {
        studentQuizId,
        userId,
        newText,
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

export const approveQuizAnswer = async (studentQuizId: string, userId: string, studentId: string, quizId: string, itemId: number, editedItem: string) => {
  try {
      const response = await axiosInstance.put(
        '/api/studentquiz/approve', 
        null, 
        {
          params: {
              studentQuizId,
              userId,
              editedItem,  
              studentId,
              quizId,
              itemId,
          }
        });
      return response.data;
  } catch (error) {
      console.error('Error approving answer:', error);
      throw error;
  }
};

export const checkQuizAnswer = async (studentQuizId: string, userId: string, studentId: string, quizId: string, itemId: number, editedItem: string) => {
  try {
      const response = await axiosInstance.put(
        '/api/studentquiz/markcheck', 
        null, 
        {
          params: {
              studentQuizId,
              userId,
              editedItem,  
              studentId,
              quizId,
              itemId,
          }
        });
      return response.data;
  } catch (error) {
      console.error('Error approving answer:', error);
      throw error;
  }
};

export const disapproveQuizAnswer = async (studentQuizId: string, userId: string, studentId: string, quizId: string, itemId: number, editedItem: string) => {
  try {
    const response = await axiosInstance.put(
      '/api/studentquiz/markuncheck', 
      null, 
      {
        params: {
          studentQuizId,
          userId, 
          editedItem,
          studentId,
          quizId,
          itemId,
        }
      });
    return response.data;
  } catch (error) {
    console.error('Error disapproving answer:', error);
    throw error;
  }
};
  
export const deleteStudentQuiz = async (studentId: string, quizId: string) => {
  try {
    const response = await axiosInstance.delete(
      '/api/studentquiz/delete', 
      {
        params: { studentId, quizId },
      });
    toast.success("Score deleted successfully!");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || "Error deleting the score";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred");
    }
    throw error;
  }
};

export const recordActivityLog = async (userId: string, studentQuizId: string, activity: string,) => {
  try {
    const response = await axiosInstance.post(
      '/api/studentquiz/record',   
      {
        userId: userId,
        studentQuizId: studentQuizId,
        activity: activity,
      },
      {
        headers: {
          "Content-Type": "application/json", 
        },
      }
    );

    toast.success("Activity logged successfully!");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || "Error logging activity";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred while logging activity");
    }
    throw error;
  }
};

export const getAllActivityLogs = async (studentQuizId: string) => {
  try {
    const response = await axiosInstance.get(
      '/api/studentquiz/logs/all',
      {
        params: {
          studentQuizId, 
        },
      }
    );

    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || "Error retrieving activity logs";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred while retrieving activity logs");
    }
    throw error;
  }
};

export const addFeedbackToEditedAnswerPerItem = async (studentQuizId: string, itemId: number, feedback: string) => {
  try {
    const response = await axiosInstance.put(
      '/api/studentquiz/addfeedbackperitem',
      null, 
      {
        params: {
          studentQuizId,
          itemId,
          feedback,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || "Error adding feedback";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred while adding feedback");
    }
    throw error;
  }
};

