import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '../Common/Thumbnail';

interface ClassItem {
    title: string;
}

interface TeacherDashboardProps {
    classes: ClassItem[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ classes }) => {
    return (
        <div className='TeacherDashboard MainContent'>
            <div className='title-container'>
                <h2>Classes</h2>
                <Link to='/dashboard/create-class'>Create class</Link>
            </div>

            <div>
                <ul className='classes'>
                    {classes.map((item, i) => (
                        <Link to='/dashboard/class' key={i}>
                            <li>
                                <Thumbnail />
                                <div>{item.title}</div>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TeacherDashboard;
