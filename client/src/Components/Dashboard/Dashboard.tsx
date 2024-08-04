import Header from '../Common/Header';
import TeacherDashboard from './TeacherDashboard';
import robot from '../../assets/robot.svg';
import Gradients from '../Common/Gradients';
import StudentDashboard from './StudentDashboard';
import { useCurrUser } from '../Context/UserContext';

const Dashboard = () => {
    const classes = [
        {
            title: 'Grade 1 - A',
        },
        {
            title: 'Grade 1 - A',
        },
        {
            title: 'Grade 1 - A',
        },
        {
            title: 'Grade 1 - A',
        },
        {
            title: 'Grade 1 - A',
        },
        {
            title: 'Grade 1 - A',
        },
        {
            title: 'Grade 1 - A',
        },
        {
            title: 'Grade 1 - A',
        },
    ];

    const { userType } = useCurrUser();

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
