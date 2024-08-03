import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

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
    }
  );
  return response.data;
};

export const getUserType = async (username: string) => {
  const response = await axios.get(`${API_BASE_URL}/getusertype?username=${username}`);
  return response.data;
};

export const registerUser = async (firstname: string, lastname: string, username: string, password: string, userType: string) => {
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
    }
  );
  return response.data;
};
