import React from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '../Common/Thumbnail';
import { ClassInterface } from '../Interface/ClassInterface';
import { useClass } from '../Context/ClassContext';

interface StudentDashboardProps {
    classes: ClassInterface[];
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ classes }) => {
    const { setClass } = useClass();

    return (
        <div className='StudentDashboard MainContent'>
            <div className='title-container'>
                <h2>Classes</h2>
            </div>

            <div>
                <ul className='classes'>
                    {classes.length > 0 ? (
                        classes.map((item, i) => (
                            <Link to={`/dashboard/class/${item.classid}`} key={i}>
                                <li onClick={() => setClass(item)}>
                                    <Thumbnail name={item.classname} />
                                    {/* <div>{item.classname}</div> */}
                                </li>
                            </Link>
                        ))
                    ) : (
                        <h1 className='empty-state'>
                            You have not enrolled in any classes yet.
                        </h1>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default StudentDashboard;
