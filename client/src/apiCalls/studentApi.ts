import axios from 'axios';
import { Student } from '../Components/Interface/StudentInterface'; 
import axiosInstance from './common/axiosInstance';

export const fetchStudentsByClassId = async (classId: string): Promise<Student[]> => {
    try {
        const response = await axiosInstance.get<Student[]>(
            '/api/students/getstudentsbyclassid',
            {
                params : { classid: classId }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error; 
    }
};

export const addStudentToClass = async (studentId: string, classId: string) => {
    try {
        const response = await axiosInstance.put(
            '/api/students/addclasstostudent',
            null,
            {
                params : {
                    userid: studentId,
                    classid: classId
                }
            }
        );
        return response.data; 
    } catch (error) {
        console.error('Error adding student:', error);
        throw error; 
    }
};


