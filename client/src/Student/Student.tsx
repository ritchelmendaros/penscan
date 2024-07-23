import LandingPage from './LandingPage/LandingPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Student = () => {
    return (
        <BrowserRouter>
            <div className='Student'>
                <Routes>
                    <Route path='/' element={<LandingPage />}></Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default Student;
