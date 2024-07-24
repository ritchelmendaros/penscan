import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from '../../Common/Header';
import BtnWithRobot from '../../Common/BtnWithRobot';
import Gradients from '../../Common/Gradients';

const AddStudent = () => {
    return (
        <div className='AddStudent Main'>
            <Header />
            <main>
                <div className='content'>
                    <h2>Create class</h2>

                    <div className='input-container'>
                        <FontAwesomeIcon icon={faPlus} />
                        <input type='text' placeholder='Create class' />
                    </div>

                    <BtnWithRobot name={'Add'} />
                </div>
            </main>

            <Gradients />
        </div>
    );
};

export default AddStudent;
