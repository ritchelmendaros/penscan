import Header from '../Common/Header';
import TeacherDashboard from './TeacherDashboard';
import robot from '../../assets/robot.svg';
import Gradients from '../Common/Gradients';
import StudentDashboard from './StudentDashboard';
import { useCurrUser } from '../Context/UserContext';
import { useEffect, useState } from 'react';
import { getAllClasses } from '../../apiCalls/classAPIs';
import { ClassInterface } from '../Interface/ClassInterface';
import { useClass } from '../Context/ClassContext';

const Dashboard = () => {
    const [classes, setClasses] = useState<ClassInterface[]>([]);
    const { setClassList } = useClass();

    const { userType, user } = useCurrUser();

    useEffect(() => {
        if (user?.userid) {
            getAllClasses(user.userid)
                .then((classes: ClassInterface[]) => {
                    setClasses(classes); // Set classes state
                    setClassList(classes); // Update class list context
                    console.log(classes);
                    console.log(user.userid);
                    console.log(user.username);
                })
                .catch((error) => {
                    console.error('Failed to get user details:', error);
                });
        }
    }, [setClassList, user]); // Only include setClassList and user.userid

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
