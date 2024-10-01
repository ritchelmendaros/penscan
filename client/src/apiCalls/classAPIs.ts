import axios from 'axios';
import { ClassInterface } from '../Components/Interface/ClassInterface';

export const getAllClasses: (
    userID: string,
) => Promise<ClassInterface[]> = async (userID) => {
    try {
        const response = await axios.get<ClassInterface[]>(
            `https://penscan-server.onrender.com/api/classes/getclassesbyteacherid?teacherid=${userID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
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
    teacherID: string,
): Promise<PostCreateClassResponse | undefined> => {
    try {
        const response = await axios.get(
            `https://penscan-server.onrender.com/api/classes/checkclass?classname=${className}&teacherid=${teacherID}`,
        );

        if (response.data.exists) {
        } else {
            await axios.post(
                'https://penscan-server.onrender.com/api/classes/add',
                { classname: className, teacherid: teacherID },
            );
        }
    } catch (error) {
        console.error('Error creating class:', error);
        return {
            errMsg: 'An error occurred while creating the class.',
        };
    }
};

//Students
export const getUserClassesByUserId = async (userId: string): Promise<ClassInterface[]> => {
    try {
        const response = await axios.get<ClassInterface[]>(
            `https://penscan-server.onrender.com/api/students/getclassidsbyuserid?userid=${userId}`,
        );
        const classIds = response.data;
        if (classIds.length > 0) {
            const classDetailsResponse = await axios.get<ClassInterface[]>(
                `https://penscan-server.onrender.com/api/classes/getclassdetails?classids=${classIds.join(",")}`
            );
            return classDetailsResponse.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching user classes:', error);
        throw error;
    }
};
