import { Link } from 'react-router-dom';
import Thumbnail from '../Common/Thumbnail';

const TeacherDashboard = ({ classes }) => {
    return (
        <div className='TeacherDashboard MainContent'>
            <div className='title-container'>
                <h2>Classes</h2>
                <Link to={'/dashboard/create-class'}>Create class</Link>
            </div>

            <div>
                <ul className='classes'>
                    {classes.map((item, i) => (
                        <Link to={'/dashboard/class'}>
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
