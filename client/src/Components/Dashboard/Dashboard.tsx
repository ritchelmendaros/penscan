import Header from '../Common/Header';
import TeacherDashboard from './TeacherDashboard';
import robot from '../../assets/robot.svg';
import Gradients from '../Common/Gradients';
import StudentDashboard from './StudentDashboard';
import { useCurrUser } from '../Context/UserContext';
import { useEffect, useState } from 'react';
import { getAllClasses } from '../../apiCalls/classAPIs';
import { Class } from '../Interface/Class';

const Dashboard = () => {
    const [classes, setClasses] = useState<Class[]>([]);

    const { userType, user } = useCurrUser();

    useEffect(() => {
        if (user?.userid) {
            getAllClasses(user.userid)
                .then((classes) => {
                    // Set classes state
                    setClasses(classes);
                    console.log(classes);
                })
                .catch((error) => {
                    console.error('Failed to get user details:', error);
                });
        }
    }, [user]);

    return (
        <div className='Dashboard Main MainContent'>
            <Header />
            <main>
                {userType === 'Teacher' ? (
                    <TeacherDashboard classes={classes} />
                ) : userType === 'Student' ? (
                    <StudentDashboard classes={classes} />
                ) : null}
            </main>

            <img src={robot} alt='' className='robot' />

            <Gradients />
        </div>
    );
};

export default Dashboard;
