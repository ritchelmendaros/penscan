import React, { useEffect, useState } from 'react';
import Header from '../Common/Header';
import TeacherDashboard from './TeacherDashboard';
import robot from '../../assets/robot.svg';
import Gradients from '../Common/Gradients';
import StudentDashboard from './StudentDashboard';
import { useCurrUser } from '../Context/UserContext';
import { getAllClasses, getUserClassesByUserId } from '../../apiCalls/classAPIs';
import { ClassInterface } from '../Interface/ClassInterface';
import { useClass } from '../Context/ClassContext';
import { getDetailsByUsername } from '../../apiCalls/userApi';

const Dashboard = () => {
    const [classes, setClasses] = useState<ClassInterface[]>([]);
    const { setClassList } = useClass();
    const { userType, user } = useCurrUser();

    useEffect(() => {
        if (user?.userid) {
            if (userType === 'Teacher') {
                getAllClasses(user.userid)
                    .then((classes: ClassInterface[]) => {
                        setClasses(classes);
                        setClassList(classes);
                    })
                    .catch((error) => {
                        console.error('Failed to get classes:', error);
                    });
            } else if (userType === 'Student') {
                getDetailsByUsername(user.username)
                    .then((userDetails) => {
                        return getUserClassesByUserId(userDetails.userid);
                    })
                    .then((userClasses: ClassInterface[]) => {
                        setClasses(userClasses);
                        setClassList(userClasses);
                    })
                    .catch((error) => {
                        console.error('Failed to get user classes:', error);
                    });
            }
        }
    }, [setClassList, user, userType]);

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
