import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from '../../../Common/Header';
import BtnWithRobot from '../../../Common/BtnWithRobot';
import Gradients from '../../../Common/Gradients';
import { Link } from 'react-router-dom';
import InputContainer from '../../../Common/InputContainer';

const AddStudent = () => {
    return (
        <div className='AddStudent Main MainContent'>
            <Header />
            <main>
                <div className='content'>
                    <h2>Add Student</h2>

                    <InputContainer icon={faPlus} placeholder={'Add student'} />

                    <Link to={'/dashboard/class'}>
                        <BtnWithRobot name={'Add'} />
                    </Link>
                </div>
            </main>

            <Gradients />
        </div>
    );
};

export default AddStudent;
