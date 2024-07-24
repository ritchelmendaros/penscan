import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';
import logo from '../../assets/penscan-logo.svg';

const Login = () => {
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
                    <form action=''>
                        <div className='input-container'>
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className='icon'
                            />
                            <input type='email' placeholder='email' />
                        </div>
                        <div className='input-container'>
                            <FontAwesomeIcon icon={faLock} className='icon' />
                            <input type='password' placeholder='password' />
                        </div>

                        <p>
                            Don't have an account?{' '}
                            <span>
                                <Link to={'/sign-up'}>Sign-up</Link>
                            </span>
                        </p>

                        <Link to={'/dashboard'} className='login'>
                            Login
                        </Link>
                    </form>
                </div>

                <div className='gradient' />
            </main>
        </div>
    );
};

export default Login;
