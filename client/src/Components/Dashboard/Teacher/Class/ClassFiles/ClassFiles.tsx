import Thumbnail from '../../../../Common/Thumbnail';

const ClassFiles = () => {
    const quizzes = [
        {
            name: 'Quiz 1',
            date: '7/25/2024',
        },
        {
            name: 'Quiz 1',
            date: '7/25/2024',
        },
        {
            name: 'Quiz 1',
            date: '7/25/2024',
        },
    ];
    return (
        <div className='ClassFiles'>
            <ul>
                {quizzes.map((item, i) => (
                    <li>
                        <Thumbnail />
                        <p>{item.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassFiles;
