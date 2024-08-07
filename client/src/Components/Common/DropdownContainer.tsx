import React, { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface DropdownContainerProps {
    icon: IconProp;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void; 
    onFocus?: () => void; 
    list?: string; 
    children?: React.ReactNode;
}

const DropdownContainer: React.FC<DropdownContainerProps> = ({
    icon,
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    list,
    children,
}) => {
    return (
        <div className='InputContainer'>
            <FontAwesomeIcon icon={icon} className='icon' />
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                list={list} 
            />
            <div className="tags-container">{children}</div>
        </div>
    );
};

export default DropdownContainer;
