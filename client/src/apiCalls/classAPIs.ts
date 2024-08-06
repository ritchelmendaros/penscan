import axios from 'axios';
import { Class } from '../Components/Interface/Class';

export const getAllClasses: (userID: string) => Promise<Class[]> = async (
    userID,
) => {
    try {
        const response = await axios.get<Class[]>(
            `http://localhost:8080/api/classes/getclassesbyteacherid?teacherid=${userID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};
