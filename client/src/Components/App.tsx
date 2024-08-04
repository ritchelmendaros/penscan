import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../styles/App.scss';
import LandingPage from './LandingPage/LandingPage';
import Login from './Authentication/Login';
import Dashboard from './Dashboard/Dashboard';
import CreateClass from './Teacher/CreateClass';
import { useState } from 'react';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import Class from './Teacher/Class/Class';
import AddStudent from './Teacher/Class/ClassStudents/AddStudent';
import AddQuiz from './Teacher/Class/ClassFiles/AddQuiz';
import Signup from './Authentication/Signup';
import { useCurrUser } from './Context/UserContext';

const App = () => {
    const { userType } = useCurrUser();

    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/sign-up' element={<Signup />} />
                    {userType === 'Teacher' ? (
                        <>
                            <Route path='/dashboard' element={<Dashboard />} />

                            <Route
                                path='/dashboard/create-class'
                                element={<CreateClass />}
                            />
                            <Route
                                path='/dashboard/class'
                                element={<Class />}
                            />
                            <Route
                                path='/dashboard/class/add-student'
                                element={<AddStudent />}
                            />
                            <Route
                                path='/dashboard/class/add-quiz'
                                element={<AddQuiz />}
                            />
                        </>
                    ) : userType === 'Student' ? (
                        <>
                            <Route path='/dashboard' element={<Dashboard />} />
                        </>
                    ) : null}
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
