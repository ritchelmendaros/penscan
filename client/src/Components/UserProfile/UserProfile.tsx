import { useState, useRef, useEffect } from 'react';
import Header from '../Common/Header';
import { useCurrUser } from '../Context/UserContext';
import robotHeartWink from '../../assets/robot-heart-wink.svg';
import Gradients from '../Common/Gradients';
import { toast, ToastContainer } from 'react-toastify';
import { updateUserDetails } from '../../apiCalls/userApi';

const UserProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const { user, setUser } = useCurrUser();
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const [firstName, setFirstName] = useState(user?.firstname || '');
    const [lastName, setLastName] = useState(user?.lastname || '');
    

    useEffect(() => {
        if (isEdit && firstNameRef.current) {
            firstNameRef.current.focus(); 
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

    const handleSave = async () => {
        if (user) {
            try {
                await updateUserDetails(user.username, firstName, lastName);
                setUser({
                    ...user,
                    firstname: firstName,
                    lastname: lastName,
                });
                handleClick(false); 
            } catch (error) {
                console.error('Failed to update user details', error);
                toast.error('Failed to update user details. Please try again.');
            }
        }
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
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEdit}
                    />
                    <label htmlFor='lastname'>Last Name</label>
                    <input
                        type='text'
                        id='lastname'
                        ref={lastNameRef}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                            onClick={handleSave}
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
