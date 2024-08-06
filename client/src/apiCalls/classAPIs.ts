import axios from 'axios';
import { ClassInterface } from '../Components/Interface/ClassInterface';

export const getAllClasses: (
    userID: string,
) => Promise<ClassInterface[]> = async (userID) => {
    try {
        const response = await axios.get<ClassInterface[]>(
            `http://localhost:8080/api/classes/getclassesbyteacherid?teacherid=${userID}`,
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
        // Check if the class already exists
        const response = await axios.get(
            `http://localhost:8080/api/classes/checkclass?classname=${className}&teacherid=${teacherID}`,
        );

        if (response.data.exists) {
            // Adjust based on actual API response
            console.log({
                errMsg: 'Class name already exists.',
            });
        } else {
            // Add the new class
            const addClassResponse = await axios.post(
                'http://localhost:8080/api/classes/add',
                { classname: className, teacherid: teacherID },
            );
            console.log({
                msg: 'Class added successfully',
                data: addClassResponse.data,
            });
        }
    } catch (error) {
        console.error('Error creating class:', error);
        return {
            errMsg: 'An error occurred while creating the class.',
        };
    }
};
