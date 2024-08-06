import logo from '../../assets/penscan-logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useCurrUser } from '../Context/UserContext';
import { CurrUser } from '../Interface/CurrUser';

const Header = () => {
    const { user, setUser } = useCurrUser();
    const handleLogout = () => {
        const currUser: CurrUser = {
            firstname: '',
            lastname: '',
            password: '',
            userType: '',
            userid: '',
            username: '',
        };
        setUser(currUser);
    };
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
                <p className='user'>
                    Welcome, {user?.firstname} {user?.lastname}!
                </p>
                <FontAwesomeIcon icon={faCircleUser} className='user-icon' />
                <Link to={'/login'} onClick={() => handleLogout()}>
                    Logout
                </Link>
            </div>
        </header>
    );
};

export default Header;
