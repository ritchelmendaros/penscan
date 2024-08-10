import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import {
    loginUser,
    getUserType,
    getDetailsByUsername,
} from '../../apiCalls/userApi';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/penscan-logo.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// CONTEXT API
import { useCurrUser } from '../Context/UserContext';
import { setLocalStorage } from '../../Utils/LocalStorage';

const Login = () => {
    const navigate = useNavigate();
    const { setUserType, setUser } = useCurrUser(); /// context api for global states

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const loginResponse = await loginUser(username, password);
            const userType = await getUserType(username);

            if (userType === 'Teacher' || userType === 'Student') {
                setUserType(userType);
                getDetailsByUsername(username)
                    .then((userDetails) => {
                        // get user details
                        setUser(userDetails);
                        setLocalStorage('firstname', userDetails.firstname);
                        setLocalStorage('lastname', userDetails.lastname);
                        setLocalStorage('userType', userDetails.userType);
                        setLocalStorage('userid', userDetails.userid);
                        setLocalStorage('username', userDetails.username);
                    })
                    .catch((error) => {
                        toast.error('Failed to get user details:', error);
                    });
                navigate('/dashboard');
            } else {
                toast.error('Unknown user type');
            }
            toast.dark('Login successful:', loginResponse);
        } catch (error) {
            toast.error('Error logging in');
            setErrorMessage('Incorrect username or password');
        }
    };

    const handleCloseError = () => {
        setErrorMessage('');
    };

    return (
        <div className='Login'>
            <main>
                <div className='form-container Main'>
                    <div>
                        <Link to={'/'}>
                            <img src={logo} alt='' />
                        </Link>

                        <h2>LOGIN</h2>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className='input-container'>
                            <FontAwesomeIcon icon={faUser} className='icon' />
                            <input
                                type='text'
                                placeholder='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className='input-container'>
                            <FontAwesomeIcon icon={faLock} className='icon' />
                            <input
                                type='password'
                                placeholder='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <p>
                            Don't have an account?{' '}
                            <span>
                                <Link to={'/sign-up'}>Sign-up</Link>
                            </span>
                        </p>

                        <button type='submit' className='login'>
                            Login
                        </button>
                    </form>
                </div>
                {errorMessage && (
                    <div className='popup'>
                        <div className='popup-content'>
                            <p className='error-message'>{errorMessage}</p>
                            <button
                                className='ok-button'
                                onClick={handleCloseError}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
                <div className='gradient' />
                <ToastContainer />
            </main>
        </div>
    );
};

export default Login;
