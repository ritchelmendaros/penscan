import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '../styles/App.scss';
import LandingPage from './LandingPage/LandingPage';
import Login from './Authentication/Login';
import Dashboard from './Dashboard/Dashboard';
import CreateClass from './Dashboard/Teacher/CreateClass';
import { useState } from 'react';
import NotFoundPage from './NotFoundPage/NotFoundPage';
import Class from './Dashboard/Teacher/Class/Class';
import AddStudent from './Dashboard/Teacher/Class/ClassStudents/AddStudent';
import AddQuiz from './Dashboard/Teacher/Class/ClassFiles/AddQuiz';
import Signup from './Authentication/Signup';

const App = () => {
    const [currentUser, setCurrentUser] = useState({
        accessType: 'teacher',
    });

    return (
        <BrowserRouter>
            <div className='App'>
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/sign-up' element={<Signup />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    {currentUser.accessType === 'teacher' ? (
                        <>
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
                    ) : null}
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
