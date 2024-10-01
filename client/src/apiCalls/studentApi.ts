import axios from 'axios';
import { Student } from '../Components/Interface/StudentInterface'; 

const API_BASE_URL = 'https://penscan-server.onrender.com/api/students';

export const fetchStudentsByClassId = async (classId: string): Promise<Student[]> => {
    try {
        const response = await axios.get<Student[]>(`${API_BASE_URL}/getstudentsbyclassid?classid=${classId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error; 
    }
};

export const addStudentToClass = async (studentId: string, classId: string) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/addclasstostudent?userid=${studentId}&classid=${classId}`
        );
        return response.data; 
    } catch (error) {
        console.error('Error adding student:', error);
        throw error; 
    }
};


