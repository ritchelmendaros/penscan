import robot from '../../assets/robot.svg';
import logo from '../../assets/penscan-logo.svg';

import { Link } from 'react-router-dom';
import Gradients from '../Common/Gradients';

const LandingPage = () => {
    return (
        <div className='LandingPage Main'>
            <header>
                <div className='logo-container'>
                    <img src={logo} alt='' />
                    <h2>Penscan</h2>
                </div>
            </header>
            <main>
                <div>
                    <h1>Scan.</h1>
                    <h1>Score.</h1>
                    <h1>Analyze.</h1>

                    <Link to={'/login'}>Get started</Link>
                </div>
                <img src={robot} alt='' />
            </main>

            {/* styles */}
            <Gradients />
        </div>
    );
};

export default LandingPage;