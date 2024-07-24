import logo from '../../assets/penscan-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className='Header'>
            <Link to={'/dashboard'}>
                <div className='logo-container'>
                    <img src={logo} alt='' />
                    <h3>PenScan</h3>
                    <div className='gradient' />
                </div>
            </Link>
            <div className='user-container'>
                <FontAwesomeIcon icon={faCircleUser} className='user-icon' />
                <Link to={'/login'}>Logout</Link>
            </div>
        </header>
    );
};

export default Header;
