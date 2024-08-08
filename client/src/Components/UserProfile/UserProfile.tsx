import { useState, useRef, useEffect } from 'react';
import Header from '../Common/Header';
import { useCurrUser } from '../Context/UserContext';
import robotHeartWink from '../../assets/robot-heart-wink.svg';
import Gradients from '../Common/Gradients';
import { toast, ToastContainer } from 'react-toastify';

const UserProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const { user } = useCurrUser();
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEdit && firstNameRef.current) {
            firstNameRef.current.focus(); // Focus on the first input when entering edit mode
        }
    }, [isEdit]);

    const handleClick = (editMode: boolean) => {
        toast.dark(
            editMode
                ? 'You can now edit your details in the inputs.'
                : 'Your user details have been updated',
            {
                autoClose: 2000,
                progressStyle: {
                    background: '#77dcdc',
                },
            },
        );
        setIsEdit(editMode);
    };

    return (
        <div className='UserProfile MainContent Main'>
            <Header />
            <main>
                <div className='hello'>
                    <img src={robotHeartWink} alt='Robot heart wink' />
                    <h1>
                        Hello,{' '}
                        <span>
                            {user?.firstname} <span>{user?.lastname}!</span>
                        </span>
                    </h1>
                </div>

                <form action='' onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor='firstname'>First Name</label>
                    <input
                        type='text'
                        id='firstname'
                        ref={firstNameRef}
                        value={user?.firstname || ''}
                        disabled={!isEdit}
                    />
                    <label htmlFor='lastname'>Last Name</label>
                    <input
                        type='text'
                        id='lastname'
                        ref={lastNameRef}
                        value={user?.lastname || ''}
                        disabled={!isEdit}
                    />
                    {!isEdit ? (
                        <button type='button' onClick={() => handleClick(true)}>
                            Edit
                        </button>
                    ) : (
                        <button
                            type='button'
                            className='save'
                            onClick={() => handleClick(false)}
                        >
                            Save
                        </button>
                    )}
                </form>
            </main>

            <ToastContainer />
            <Gradients />
        </div>
    );
};

export default UserProfile;
