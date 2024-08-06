import axios from 'axios';
import {
    Quiz,
    StudentQuiz,
    StudentImageResult,
} from '../Components/Interface/Quiz';

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

export const getAllQuizScores = async (quizID: string) => {
    try {
        const response = await axios.get<StudentQuiz[]>(
            `http://localhost:8080/api/studentquiz/getscoresandstudentids?quizid=${quizID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

export const getQuizResults = async (studentID: string, quizID: string) => {
    try {
        const response = await axios.get<StudentImageResult>(
            `http://localhost:8080/api/studentquiz/get?studentid=${studentID}&quizid=${quizID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};
