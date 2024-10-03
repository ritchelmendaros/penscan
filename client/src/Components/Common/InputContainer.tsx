import React, { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface InputContainerProps {
  icon: IconProp;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputContainer: React.FC<InputContainerProps> = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="InputContainer">
      <FontAwesomeIcon icon={icon} className="icon" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default InputContainer;
