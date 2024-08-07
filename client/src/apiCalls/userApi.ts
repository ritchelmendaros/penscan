import axios from 'axios';
import { CurrUser } from '../Components/Interface/CurrUser';
import { Student } from '../Components/Interface/StudentInterface'; 

const API_BASE_URL = 'http://localhost:8080/api/users';
const USER_DETAILS = 'http://localhost:8080/api/users/getuserdetails?username=';

export const loginUser = async (username: string, password: string) => {
    const response = await axios.post(
        `${API_BASE_URL}/login`,
        {
            username,
            password,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

export const getUserType = async (username: string) => {
    const response = await axios.get(
        `${API_BASE_URL}/getusertype?username=${username}`,
    );
    return response.data;
};

export const getDetailsByUsername = async (
    username: string,
): Promise<CurrUser> => {
    try {
        const response = await axios.get<CurrUser>(
            `${USER_DETAILS}${username}`,
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export const registerUser = async (
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    userType: string,
) => {
    const response = await axios.post(
        `${API_BASE_URL}/register`,
        {
            firstname,
            lastname,
            username,
            password,
            userType,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

export const fetchAllStudents = async (): Promise<Student[]> => {
    try {
        const response = await axios.get<Student[]>(`${API_BASE_URL}/getallstudents`);
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};