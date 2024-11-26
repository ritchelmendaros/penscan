import { ClassInterface } from "../Components/Interface/ClassInterface";
import axiosInstance from "./common/axiosInstance";

export const getAllClasses: (
  userID: string
) => Promise<ClassInterface[]> = async (userID) => {
  try {
    const response = await axiosInstance.get<ClassInterface[]>(
      "/api/classes/getclassesbyteacherid",
      {
        params: { teacherid: userID },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

interface PostCreateClassResponse {
  errMsg?: string;
  msg?: string;
  data?: any;
}

export const postCreateClass = async (
  className: string,
  teacherID: string
): Promise<PostCreateClassResponse | undefined> => {
  try {
    const response = await axiosInstance.get("/api/classes/checkclass", {
      params: {
        classname: className,
        teacherid: teacherID,
      },
    });

    if (response.data.exists) {
      //
    } else {
      await axiosInstance.post("/api/classes/add", {
        classname: className,
        teacherid: teacherID,
        isactive: 1,
      });
    }
  } catch (error) {
    console.error("Error creating class:", error);
    return {
      errMsg: "An error occurred while creating the class.",
    };
  }
};

//Students
export const getUserClassesByUserId = async (
  userId: string
): Promise<ClassInterface[]> => {
  try {
    const response = await axiosInstance.get<ClassInterface[]>(
      "/api/students/getclassidsbyuserid",
      {
        params: { userid: userId },
      }
    );
    const classIds = response.data;
    if (classIds.length > 0) {
      const allClassIds = classIds.join(",");
      const classDetailsResponse = await axiosInstance.get<ClassInterface[]>(
        "/api/classes/getclassdetails",
        {
          params: { classids: allClassIds },
        }
      );
      return classDetailsResponse.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching user classes:", error);
    throw error;
  }
};

export const editClassName = async (classId: string, classname: string) => {
  try {
    const response = await axiosInstance.put("/api/classes/name/edit", null, {
      params: { classId, classname },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating class name:", error);
    throw error;
  }
};

export const deleteClass = async (classId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/classes/delete`, {
      params: { classId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

export const getTotalClassesByTeacher = async (
  teacherId: string
): Promise<number> => {
  try {
    const response = await axiosInstance.get<number>("/api/classes/total", {
      params: { teacherId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total classes by teacher:", error);
    throw error;
  }
};

export const getTotalStudentsPerClass = async (
  teacherId: string
): Promise<{ className: string; studentCount: number }[]> => {
  try {
    const response = await axiosInstance.get<
      { className: string; studentCount: number }[]
    >("/api/classes/total/studentperclass", {
      params: { teacherId },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching total students per class:", error);
    throw error;
  }
};

export const getActivityLogsByTeacher = async (teacherId: string) => {
  try {
    const response = await axiosInstance.get(
      "/api/classes/getallactivitylogs",
      {
        params: { teacherId },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    throw error;
  }
};

export const getTotalQuizzes = async (teacherId: string): Promise<number> => {
  try {
    const response = await axiosInstance.get<number>(
      "/api/classes/total/quiz",
      {
        params: { teacherId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching total quizzes:", error);
    throw error;
  }
};

export const getTotalStudents = async (teacherId: string): Promise<number> => {
  try {
    const response = await axiosInstance.get<number>(
      "/api/classes/total/students",
      {
        params: { teacherId },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching total students:", error);
    throw error;
  }
};

export const getQuizResultsPerClass = async (
  teacherId: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get<any>(
      "/api/classes/getquizresultperclass",
      {
        params: { teacherId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz results per class:", error);
    throw error;
  }
};

export const deactivateClass = async (
  classId: string
): Promise<any> => {
  try {
    const response = await axiosInstance.put("/api/classes/deactivate", null, {
      params: { classId },
    });

    if (response.status === 200) {
      return "Class deactivated.";
    }
  } catch (error) {
    console.error("Error deactivating class:", error);
    return "An error occurred while deactivating the class.";
  }
};
