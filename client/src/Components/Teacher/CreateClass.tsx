import BtnWithRobot from '../Common/BtnWithRobot';
import Header from '../Common/Header';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import Gradients from '../Common/Gradients';
import InputContainer from '../Common/InputContainer';
import { useNavigate } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import { useCurrUser } from '../Context/UserContext';
import { postCreateClass } from '../../apiCalls/classAPIs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateClass: React.FC = () => {
    const navigate = useNavigate();

    const [className, setClassName] = useState('');
    const { user } = useCurrUser();

  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setClassName(e.target.value);
    };

    const handleClick = () => {
        if (user?.userid) {
            postCreateClass(className, user.userid)
                .then(() => {
                    navigate('/dashboard');
                })
                .catch((err) => {
                    toast.error('Error creating class:', err);
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
            <ToastContainer/>
        </div>
    );
};

export default CreateClass;
