import axios from 'axios';
import {
    Quiz,
    StudentQuiz,
    StudentImageResult,
} from '../Components/Interface/Quiz';

// const BASE_URL = "https://penscan-api.onrender.com/api/studentquiz";
// const BASE_URL1 = "https://penscan-api.onrender.com/api/quiz";

export const getAllQuizes: (
    teacherID: string,
    classID: string,
) => Promise<Quiz[]> = async (teacherID, classID) => {
    try {
        const response = await axios.get<Quiz[]>(
            `https://penscan-server.onrender.com/api/quiz/getquizbyteacherid?teacherid=${teacherID}&classid=${classID}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

export const getQuizzesByClassId = async (classId: string): Promise<Quiz[]> => {
    try {
        const response = await axios.get<Quiz[]>(`https://penscan-server.onrender.com/api/quiz/getquizbyclassid?classid=${classId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quizzes by class ID:', error);
        throw error;
    }
};

export const getAllQuizScores = async (quizID: string) => {
    try {
        const response = await axios.get<StudentQuiz[]>(
            `https://penscan-server.onrender.com/api/studentquiz/getscoresandstudentids?quizid=${quizID}`,
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
            `https://penscan-server.onrender.com/api/studentquiz/get?studentid=${studentID}&quizid=${quizID}`,
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
    correctAnswer: { itemnumber: number; answer: string }[]
) => {
    try {
        const response = await axios.post(
            `https://penscan-server.onrender.com/api/quiz/addquiz`,
            {
                classid: classid,
                quizname: quizName,
                teacherid: userId,
                quizanswerkey: correctAnswer,
            },
        );
        // console.log('Quiz added:', response.data);
        return response.data; 
    } catch (error) {
        // console.error('Error adding quiz:', error);
        throw error; 
    }
};

export const getQuizAnalysis = async (quizID: string) => {
    try {
        const response = await axios.get(
            `https://penscan-server.onrender.com/api/item-analysis/getitemanalysis?quizid=${quizID}`,
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
            `https://penscan-server.onrender.com/api/students/getquizidsandnamesbyuseridandclassid?userid=${userId}&classid=${classId}`
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
            `https://penscan-server.onrender.com/api/quiz/getanswerkey?quizid=${quizId}`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching answer key:', error);
        throw error;
    }
};

