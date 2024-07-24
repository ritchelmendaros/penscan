import React from 'react';
import robot from '../../assets/smiling-robot.svg';

interface BtnWithRobotProps {
    name: string;
}

const BtnWithRobot: React.FC<BtnWithRobotProps> = ({ name }) => {
    return (
        <div className='BtnWithRobot'>
            <img src={robot} alt='Smiling Robot' />
            <button>{name}</button>
        </div>
    );
};

export default BtnWithRobot;
