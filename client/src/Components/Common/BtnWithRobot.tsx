import React from "react";
import robot from "../../assets/smiling-robot.svg";
import { SyncLoader } from "react-spinners";

interface BtnWithRobotProps {
  name: string;
  onClick?: () => void;
  loading?: boolean;
}

const BtnWithRobot: React.FC<BtnWithRobotProps> = ({ name, onClick, loading }) => {
  return (
    <div className="BtnWithRobot">
      <img src={robot} alt="Smiling Robot" />
      <button onClick={onClick} disabled={loading}>
        {loading ? <SyncLoader color="#fff" size={6} /> : name}
      </button>
    </div>
  );
};

export default BtnWithRobot;
