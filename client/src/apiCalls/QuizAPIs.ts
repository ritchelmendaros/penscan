import {
    Quiz,
    StudentQuiz,
    StudentImageResult,
} from '../Components/Interface/Quiz';
import axiosInstance from './common/axiosInstance';

// const BASE_URL = "https://penscan-api.onrender.com/api/studentquiz";
// const BASE_URL1 = "https://penscan-api.onrender.com/api/quiz";

export const getAllQuizes: (
    teacherID: string,
    classID: string,
) => Promise<Quiz[]> = async (teacherID, classID) => {
    try {
        const response = await axiosInstance.get<Quiz[]>(
            '/api/quiz/getquizbyteacherid',
            {
                params : {
                    teacherid: teacherID,
                    classid: classID
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

export const getQuizzesByClassId = async (classId: string): Promise<Quiz[]> => {
    try {
        const response = await axiosInstance.get<Quiz[]>('/api/quiz/getquizbyclassid',
            {
                params : { classid: classId }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching quizzes by class ID:', error);
        throw error;
    }
};

export const getAllQuizScores = async (quizID: string) => {
    try {
        console.log(quizID);
        const response = await axiosInstance.get<StudentQuiz[]>(
            `/api/studentquiz/getscoresandstudentids`,
            {
                params : { quizid: quizID }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
};

export const getQuizResults = async (studentID: string, quizID: string) => {
    try {
        const response = await axiosInstance.get<StudentImageResult>(
            '/api/studentquiz/get',
            {
                params : {
                    studentid: studentID,
                    quizid: quizID
                }
            }
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
    correctAnswer: { itemnumber: number; answer: string }[],
    dueDateTime: string
) => {
    try {
        const response = await axiosInstance.post(
            '/api/quiz/addquiz',
            {
                classid: classid,
                quizname: quizName,
                teacherid: userId,
                quizanswerkey: correctAnswer,
                dueDateTime: dueDateTime,
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
        const response = await axiosInstance.get(
            '/api/item-analysis/getitemanalysis',
            {
                params : { quizid: quizID }
            }
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
        const response = await axiosInstance.get<any[]>(
            '/api/students/getquizidsandnamesbyuseridandclassid',
            {
                params : {
                    userid: userId,
                    classid: classId
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz names:', error);
        throw error;
    }
};

export const getAnswerKey = async (quizId: string): Promise<string> => {
    try {
        const response = await axiosInstance.get<string>(
            '/api/quiz/getanswerkey',
            {
                params : { quizid: quizId }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching answer key:', error);
        throw error;
    }
};

