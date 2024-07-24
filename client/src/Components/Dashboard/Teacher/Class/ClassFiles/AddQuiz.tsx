import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Gradients from '../../../../Common/Gradients';
import Header from '../../../../Common/Header';
import InputContainer from '../../../../Common/InputContainer';
import BtnWithRobot from '../../../../Common/BtnWithRobot';
import { Link } from 'react-router-dom';

const AddQuiz = () => {
    return (
        <div className='AddQuiz Main MainContent'>
            <Header />
            <main>
                <div className='content'>
                    <h2>Add Quiz</h2>
                    <InputContainer
                        icon={faEnvelope}
                        placeholder={'Quiz Name'}
                    />

                    <form action='' onSubmit={(e) => e.preventDefault()}>
                        <div className='file-input-container'>
                            <label htmlFor=''>Quiz answer key</label>
                            <input type='file' />
                        </div>

                        <Link to={'/dashboard/class/'}>
                            <BtnWithRobot name={'Add'} />
                        </Link>
                    </form>
                </div>
            </main>

            <Gradients />
        </div>
    );
};

export default AddQuiz;
