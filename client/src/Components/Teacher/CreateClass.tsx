import BtnWithRobot from '../Common/BtnWithRobot';
import Header from '../Common/Header';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import Gradients from '../Common/Gradients';
import InputContainer from '../Common/InputContainer';
import { Link } from 'react-router-dom';

const CreateClass = () => {
    return (
        <div className='CreateClass Main MainContent'>
            <Header />
            <main>
                <div className='content'>
                    <h2>Create class</h2>

                    <InputContainer
                        icon={faFolder}
                        placeholder={'Create class'}
                    />

                    <Link to={'/dashboard'}>
                        <BtnWithRobot name={'Create'} />
                    </Link>
                </div>
            </main>

            <Gradients />
        </div>
    );
};

export default CreateClass;
