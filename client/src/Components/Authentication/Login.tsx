import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { loginUser, getUserType } from '../../apiCalls/userApi'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/penscan-logo.svg';

const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const loginResponse = await loginUser(username, password);

            const userType = await getUserType(username);

            if (userType === 'Student') {
                navigate(`/studentdashboard/${username}`);
            } else if (userType === 'Teacher') {
                navigate(`/teacherdashboard/${username}`);
            } else {
                console.log('Unknown user type');
            }
            console.log('Login successful:', loginResponse);
        } catch (error) {
            console.error('Error logging in:', error);
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
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className='icon'
                            />
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
                            <button className='ok-button' onClick={handleCloseError}>
                                OK
                            </button>
                        </div>
                    </div>
                )}
                <div className='gradient' />
            </main>
        </div>
    );
};

export default Login;
