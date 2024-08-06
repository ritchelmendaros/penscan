import BtnWithRobot from '../Common/BtnWithRobot';
import Header from '../Common/Header';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import Gradients from '../Common/Gradients';
import InputContainer from '../Common/InputContainer';
import { useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import { useCurrUser } from '../Context/UserContext';
import { postCreateClass } from '../../apiCalls/classAPIs';

const CreateClass: React.FC = () => {
    const navigate = useNavigate();

    const [className, setClassName] = useState('');
    const { user } = useCurrUser();

    // Handle input change
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setClassName(e.target.value);
    };

    const handleClick = () => {
        if (user?.userid) {
            postCreateClass(className, user.userid)
                .then(() => {
                    // Navigate only after successful creation
                    navigate('/dashboard');
                })
                .catch((err) => {
                    console.error('Error creating class:', err);
                });
        }
    };

    return (
        <div className='CreateClass Main MainContent'>
            <Header />
            <main>
                <div className='content'>
                    <h2>Create class</h2>

                    <InputContainer
                        icon={faFolder}
                        placeholder={'Create class'}
                        value={className}
                        onChange={handleInputChange}
                    />

                    <BtnWithRobot name={'Create'} onClick={handleClick} />
                </div>
            </main>

            <Gradients />
        </div>
    );
};

export default CreateClass;
