import { useEffect, useState } from 'react';
import Header from '../Common/Header';
import TeacherDashboard from './TeacherDashboard';
import robot from '../../assets/robot.svg';
import Gradients from '../Common/Gradients';
import StudentDashboard from './StudentDashboard';
import { useCurrUser } from '../Context/UserContext';
import {
    getAllClasses,
    getUserClassesByUserId,
} from '../../apiCalls/classAPIs';
import { ClassInterface } from '../Interface/ClassInterface';
import { useClass } from '../Context/ClassContext';
import { getDetailsByUsername } from '../../apiCalls/userApi';
import { ToastContainer, toast } from 'react-toastify';
import { SyncLoader } from 'react-spinners'; 
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const [classes, setClasses] = useState<ClassInterface[]>([]);
    const { setClassList } = useClass();
    const { userType, user } = useCurrUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.userid) {
            setLoading(true); 
            if (userType === 'Teacher') {
                getAllClasses(user.userid)
                    .then((classes: ClassInterface[]) => {
                        setClasses(classes);
                        setClassList(classes);
                    })
                    .catch((error) => {
                        toast.error('Failed to get classes:', error);
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
                        toast.error('Failed to get user classes:', error);
                    })
                    .finally(() => {
                            setLoading(false); // End loading
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
                    <StudentDashboard classes={classes} loading={loading} />
                ) : null}
            </main>

            <img src={robot} alt='' className='robot' />

            <Gradients />
            <ToastContainer />
        </div>
    );
};

export default Dashboard;
