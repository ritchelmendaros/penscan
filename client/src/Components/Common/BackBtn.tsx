import React from "react";
import { useNavigate } from "react-router-dom";
import backButton from "../../assets/back-button.png";

interface BackBtnProps {
  className?: string;
  onClick?: () => void;
}

const BackBtn: React.FC<BackBtnProps> = ({ className = "", onClick }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <img
      src={backButton}
      alt="Back"
      onClick={handleBack}
      className={`back-button ${className}`}
    />
  );
};

export default BackBtn;
