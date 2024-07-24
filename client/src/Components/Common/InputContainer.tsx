import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputContainer = ({ icon, placeholder }) => {
    return (
        <div className='InputContainer'>
            <FontAwesomeIcon icon={icon} className='icon' />
            <input type='text' placeholder={placeholder} />
        </div>
    );
};

export default InputContainer;
