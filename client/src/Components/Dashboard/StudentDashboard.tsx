import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '../Common/Thumbnail';
import { Class } from '../Interface/Class';

interface StudentDashboardProps {
    classes: Class[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ classes }) => {
    return (
        <div className='StudentDashboard MainContent'>
            <div className='title-container'>
                <h2>Classes</h2>
            </div>

            <div>
                <ul className='classes'>
                    {classes.map((item, i) => (
                        <Link to='/dashboard/class' key={i}>
                            <li>
                                <Thumbnail />
                                <div>{item.classname}</div>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StudentDashboard;
