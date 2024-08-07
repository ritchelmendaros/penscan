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

export const addQuiz = async (
    classid: string,
    quizName: string,
    userId: string,
    correctAnswer: string,
) => {
    try {
        const response = await axios.post(
            'http://localhost:8080/api/quiz/addquiz',
            {
                classid: classid,
                quizname: quizName,
                teacherid: userId,
                quizanswerkey: correctAnswer,
            },
        );
        console.log('Quiz added:', response.data);
        return response.data; // Return the response data for further use if needed
    } catch (error) {
        console.error('Error adding quiz:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const getQuizAnalysis = async (quizID: string) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/api/item-analysis/getitemanalysis?quizid=${quizID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

//Student
export const getQuizNamesByUserIdAndClassId = async (userId: string, classId: string): Promise<any[]> => {
    try {
        const response = await axios.get<any[]>(
            `http://localhost:8080/api/students/getquizidsandnamesbyuseridandclassid?userid=${userId}&classid=${classId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz names:', error);
        throw error;
    }
};

export const getAnswerKey = async (quizId: string): Promise<string> => {
    try {
        const response = await axios.get<string>(
            `http://localhost:8080/api/quiz/getanswerkey?quizid=${quizId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching answer key:', error);
        throw error;
    }
};