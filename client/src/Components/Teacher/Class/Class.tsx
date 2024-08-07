import { useState } from 'react';
import Gradients from '../../Common/Gradients';
import Header from '../../Common/Header';
import { Link } from 'react-router-dom';
import ClassFiles from './ClassFiles/ClassFiles';
import ClassStudents from './ClassStudents/ClassStudents';
import SmilingRobot from '../../Common/SmilingRobot';
import { useClass } from '../../Context/ClassContext';

const Class = () => {
    const [option, setOption] = useState('class-files');
    const { clickedClass } = useClass();
    
    return (
        <div className='Class Main MainContent'>
            <Header />
            <main>
                <div className='btn-container'>
                    <div>
                        <button
                            onClick={() => setOption('class-files')}
                            className={
                                option === 'class-files' ? 'active' : 'inactive'
                            }
                        >
                            Class Files
                        </button>
                        <button
                            onClick={() => setOption('students')}
                            className={
                                option === 'students' ? 'active' : 'inactive'
                            }
                        >
                            Students
                        </button>
                    </div>

                    {option === 'class-files' ? (
                        <Link to={'/dashboard/class/add-quiz'}>
                            <button className='add-btn'>Add Quiz</button>
                        </Link>
                    ) : (
                        <Link to={'/dashboard/class/add-student'}>
                            <button className='add-btn'>Add Student</button>
                        </Link>
                    )}
                </div>

                {option === 'class-files' && <ClassFiles />}
                {option === 'students' && clickedClass && <ClassStudents classId={clickedClass.classid} />}
            </main>
            <SmilingRobot />
            <Gradients />
        </div>
    );
};

export default Class;
