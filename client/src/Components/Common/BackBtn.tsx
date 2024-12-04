import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backButton from "../../assets/back-button.png";

interface BackBtnProps {
  className?: string;
  onClick?: () => void;
  dynamicRoutes?: Record<string, string | (() => string)>;
}

const BackBtn: React.FC<BackBtnProps> = ({ className = "", onClick, dynamicRoutes }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else if (dynamicRoutes) {
      const matchedRoute = Object.keys(dynamicRoutes).find((path) =>
        new RegExp(path.replace(/:\w+/g, "\\w+")).test(location.pathname)
      );

      if (matchedRoute) {
        const route = dynamicRoutes[matchedRoute];
        if (typeof route === "string") {
          navigate(route);
        } else if (typeof route === "function") {
          navigate(route());
        }
        return;
      }
    }

    // Default behavior: go back one page
    navigate(-1);
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
