// import axios from 'axios';
import { CurrUser } from '../Components/Interface/CurrUser';
import { Student } from '../Components/Interface/StudentInterface'; 
import axiosInstance from './common/axiosInstance';

// const API_BASE_URL = 'https://penscan-server.onrender.com/api/users';
// const USER_DETAILS = 'https://penscan-server.onrender.com/api/users/getuserdetails?username=';

export const loginUser = async (username: string, password: string) => {
    const response = await axiosInstance.post(
        '/api/users/login',
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
    const response = await axiosInstance.get(
        '/api/users/getusertype',
        {
            params : { username: username }
        }
    );
    return response.data;
};

export const getDetailsByUsername = async (
    username: string,
): Promise<CurrUser> => {
    try {
        const response = await axiosInstance.get<CurrUser>(
            '/api/users/getuserdetails',
            {
                params : { username: username }
            }
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
    const response = await axiosInstance.post(
        '/api/users/register',
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
        const response = await axiosInstance.get<Student[]>(
            '/api/users/getallstudents'
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Function to update user details
export const updateUserDetails = async (
    username: string,
    firstName: string,
    lastName: string,
) => {
    try {
        const response = await axiosInstance.put(
            '/api/users/updateuserdetails',
            {
                username,
                firstname: firstName,
                lastname: lastName,
            }
        );
        return response.data; 
    } catch (error) {
        throw error; 
    }
};