import { useEffect, useState } from 'react';
import Gradients from '../../Common/Gradients';
import Header from '../../Common/Header';
import { Link } from 'react-router-dom';
import ClassFiles from './ClassFiles/ClassFiles';
import ClassStudents from './ClassStudents/ClassStudents';
import SmilingRobot from '../../Common/SmilingRobot';
import { useClass } from '../../Context/ClassContext';
import {
    getArrayFromLocalStorage,
    getFromLocalStorage,
    saveArrayToLocalStorage,
    setLocalStorage,
} from '../../../Utils/LocalStorage';

const Class = () => {
    const [option, setOption] = useState('class-files');
    const { clickedClass, setClass } = useClass();

    useEffect(() => {
        if (clickedClass) {
            setLocalStorage('classCode', clickedClass.classCode);
            setLocalStorage('classid', clickedClass.classid);
            setLocalStorage('classname', clickedClass.classname);
            saveArrayToLocalStorage('studentid', clickedClass.studentid);
            setLocalStorage('teacherid', clickedClass.teacherid);
        }

        if (!clickedClass) {
            setClass({
                classCode: '',
                classid: getFromLocalStorage('classid'),
                classname: getFromLocalStorage('classname'),
                studentid: getArrayFromLocalStorage('studentid'),
                teacherid: getFromLocalStorage('teacherid'),
                isactive: 1,
            });
        }
    });

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
                {option === 'students' && clickedClass && (
                    <ClassStudents classId={clickedClass.classid} />
                )}
            </main>
            <SmilingRobot />
            <Gradients />
        </div>
    );
};

export default Class;
