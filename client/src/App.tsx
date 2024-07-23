import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.scss';
import LandingPage from './Components/LandingPage/LandingPage';
import Login from './Components/Authentication/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateClass from './Components/Teacher/CreateClass';
import { useState } from 'react';

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
                    <Route path='/dashboard' element={<Dashboard />} />
                    {currentUser.accessType === 'teacher' && (
                        <Route
                            path='/dashboard/create-class'
                            element={<CreateClass />}
                        />
                    )}
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default App;
