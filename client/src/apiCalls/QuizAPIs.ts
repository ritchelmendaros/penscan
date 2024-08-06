import axios from 'axios';
import { Quiz } from '../Components/Interface/Quiz';

export const getAllQuizes: (
    teacherID: string,
    classID: string,
) => Promise<Quiz[]> = async (teacherID, classID) => {
    try {
        const response = await axios.get<Quiz[]>(
            `http://localhost:8080/api/quiz/getquizbyteacherid?teacherid=${teacherID}&classid=${classID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};
