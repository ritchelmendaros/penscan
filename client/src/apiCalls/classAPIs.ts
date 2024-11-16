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
  data?: any; // Adjust type based on the expected response data
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
    const response = await axiosInstance.get<number>(
      "/api/classes/total",
      {
        params: { teacherId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching total classes by teacher:", error);
    throw error;
  }
};
