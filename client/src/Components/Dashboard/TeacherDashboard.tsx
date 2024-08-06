import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '../Common/Thumbnail';
import { ClassInterface } from '../Interface/ClassInterface';
import { useClass } from '../Context/ClassContext';

interface TeacherDashboardProps {
    classes: ClassInterface[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ classes }) => {
    const { setClass } = useClass();
    return (
        <div className='TeacherDashboard MainContent'>
            <div className='title-container'>
                <h2>Classes</h2>
                <Link to='/dashboard/create-class'>Create class</Link>
            </div>

            <div>
                <ul className='classes'>
                    {classes.length > 0 ? (
                        classes.map((item, i) => (
                            <Link to='/dashboard/class' key={i}>
                                <li onClick={() => setClass(item)}>
                                    <Thumbnail name={item.classname} />
                                    {/* <div>{item.classname}</div> */}
                                </li>
                            </Link>
                        ))
                    ) : (
                        <h1 className='empty-state'>
                            There are no created classes yet.
                        </h1>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default TeacherDashboard;
