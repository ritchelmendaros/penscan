import axios from 'axios';
import { CurrUser } from '../Components/Interface/CurrUser';
import { Student } from '../Components/Interface/StudentInterface'; 

const API_BASE_URL = 'https://penscan-api.onrender.com/api/users';
const USER_DETAILS = 'https://penscan-api.onrender.com/api/users/getuserdetails?username=';

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

// Function to update user details
export const updateUserDetails = async (
    username: string,
    firstName: string,
    lastName: string,
) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/updateuserdetails`,
            {
                username,
                firstname: firstName,
                lastname: lastName,
            }
        );
        // console.log("User details updated", response);
        return response.data; // Return updated user data if needed
    } catch (error) {
        // console.error("Error updating user details", error);
        throw error; // Re-throw error for handling in the calling function
    }
};