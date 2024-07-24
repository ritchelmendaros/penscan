import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InputContainer = ({ icon, type, placeholder }) => {
    return (
        <div className='InputContainer'>
            <FontAwesomeIcon icon={icon} className='icon' />
            <input type={type ? type : 'text'} placeholder={placeholder} />
        </div>
    );
};

export default InputContainer;
