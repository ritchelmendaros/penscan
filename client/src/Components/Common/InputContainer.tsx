import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface InputContainerProps {
    icon: IconProp;
    type?: string;
    placeholder: string;
}

const InputContainer: React.FC<InputContainerProps> = ({
    icon,
    type,
    placeholder,
}) => {
    return (
        <div className='InputContainer'>
            <FontAwesomeIcon icon={icon} className='icon' />
            <input type={type ? type : 'text'} placeholder={placeholder} />
        </div>
    );
};

export default InputContainer;
