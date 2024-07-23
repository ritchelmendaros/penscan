import { Link } from 'react-router-dom';

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
                        <li>
                            <div className='box' />
                            <div>{item.title}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TeacherDashboard;
