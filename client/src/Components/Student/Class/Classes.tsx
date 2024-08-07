import { useState } from 'react';
import Gradients from '../../Common/Gradients';
import Header from '../../Common/Header';
import { Link } from 'react-router-dom';
import ClassFiles from '../../Student/Class/ClassFiles';
import SmilingRobot from '../../Common/SmilingRobot';

const Classes = () => {
    return (
        <div className='Class Main MainContent'>
            <Header />
            <main>
                <div className='btn-container'>
                    <div>
                        Class Quizzes
                    </div>
                </div>
                <ClassFiles/> 
            </main>
            <SmilingRobot />
            <Gradients />
        </div>
    );
};

export default Classes;