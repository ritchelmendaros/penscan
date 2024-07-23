import robot from '../../assets/smiling-robot.svg';

const BtnWithRobot = ({ name }) => {
    return (
        <div className='BtnWithRobot'>
            <img src={robot} alt='' />
            <button>{name}</button>
        </div>
    );
};

export default BtnWithRobot;
