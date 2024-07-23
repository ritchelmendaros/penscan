import Header from '../Common/Header';
import TeacherDashboard from './TeacherDashboard';
import robot from '../../assets/robot.svg';
import Gradients from '../Common/Gradients';

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
    return (
        <div className='Dashboard Main'>
            <Header />
            <main>
                <TeacherDashboard classes={classes} />
            </main>

            <img src={robot} alt='' className='robot' />

            <Gradients />
        </div>
    );
};

export default Dashboard;
