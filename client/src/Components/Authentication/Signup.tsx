import React, { useState } from 'react';
import Gradients from '../Common/Gradients';
import InputContainer from '../Common/InputContainer';
import {
    faCircleUser,
    faEnvelope,
    faLock,
} from '@fortawesome/free-solid-svg-icons';

import robotHeart from '../../assets/robot-with-heart.svg';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    return (
        <div className='Signup Main'>
            {/* <main> */}
            <form action='' onSubmit={(e) => e.preventDefault()}>
                <h1>SIGN UP</h1>
                <InputContainer icon={faCircleUser} placeholder={'firstname'} />
                <InputContainer icon={faCircleUser} placeholder={'lastname'} />
                <InputContainer
                    icon={faEnvelope}
                    type={'email'}
                    placeholder={'email'}
                />
                <InputContainer
                    icon={faLock}
                    type={'password'}
                    placeholder={'password'}
                />
                <div className='radio-container'>
                    <div className='radio'>
                        <input
                            type='radio'
                            id='student'
                            name='options'
                            value='student'
                            checked={selectedOption === 'student'}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor='student'>Student</label>
                    </div>
                    <div className='radio'>
                        <input
                            type='radio'
                            id='teacher'
                            name='options'
                            value='teacher'
                            checked={selectedOption === 'teacher'}
                            onChange={handleOptionChange}
                        />
                        <label htmlFor='teacher'>Teacher</label>
                    </div>
                </div>

                <Link to={'/dashboard'}>
                    <button>Signup</button>
                </Link>
            </form>

            <div className='img-container'>
                <img src={robotHeart} alt='' />
                <p>
                    Have an account?{' '}
                    <span>
                        <Link to={'/login'}>Login</Link>
                    </span>
                </p>
            </div>

            <Gradients />
        </div>
    );
};

export default Signup;
