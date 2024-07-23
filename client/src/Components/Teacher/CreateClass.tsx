import BtnWithRobot from '../Common/BtnWithRobot';
import Header from '../Common/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import Gradients from '../Common/Gradients';

const CreateClass = () => {
    return (
        <div className='CreateClass Main'>
            <Header />
            <main>
                <div className='content'>
                    <h2>Create class</h2>

                    <div className='input-container'>
                        <FontAwesomeIcon icon={faFolder} />
                        <input type='text' placeholder='Create class' />
                    </div>

                    <BtnWithRobot name={'Create'} />
                </div>
            </main>

            <Gradients />
        </div>
    );
};

export default CreateClass;
