import { useState } from 'react';
import Header from '../Common/Header';
import { useCurrUser } from '../Context/UserContext';
import robotHeartWink from '../../assets/robot-heart-wink.svg';
import Gradients from '../Common/Gradients';
import { toast, ToastContainer } from 'react-toastify';

const UserProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const { user } = useCurrUser();

    const handleClick = (isEdit: boolean) => {
        toast.dark(
            isEdit
                ? 'You can now edit your details in the inputs.'
                : 'Your user details have been updated',
            {
                autoClose: 1000,
                progressStyle: {
                    background: '#77dcdc',
                },
            },
        );
        setIsEdit(isEdit);
    };

    return (
        <div className='UserProfile MainContent Main'>
            <Header />
            <main>
                <div className='hello'>
                    <img src={robotHeartWink} alt='' />
                    <h1>
                        Hello,{' '}
                        <span>
                            {user?.firstname} <span>{user?.lastname}!</span>
                        </span>
                    </h1>
                </div>

                <form action='' onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor=''>First Name</label>
                    <input
                        type='text'
                        value={user?.firstname}
                        disabled={!isEdit}
                    />
                    <label htmlFor=''>Last Name</label>
                    <input
                        type='text'
                        value={user?.lastname}
                        disabled={!isEdit}
                    />
                    {!isEdit ? (
                        <button
                            onClick={() => {
                                handleClick(true);
                            }}
                        >
                            Edit
                        </button>
                    ) : (
                        <button
                            className='save'
                            onClick={() => {
                                handleClick(false);
                            }}
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
