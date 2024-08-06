import React from 'react';
import robot from '../../assets/smiling-robot.svg';

interface BtnWithRobotProps {
    name: string;
    onClick?: () => void; // Add onClick prop
}

const BtnWithRobot: React.FC<BtnWithRobotProps> = ({ name, onClick }) => {
    return (
        <div className='BtnWithRobot'>
            <img src={robot} alt='Smiling Robot' />
            <button onClick={onClick}>{name}</button>
        </div>
    );
};

export default BtnWithRobot;
