const ClassStudents = () => {
    const students = [
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
        {
            name: 'John Doe',
            userID: 'xashd13h',
            dateJoined: '7/25/2024',
            email: 'johndoe@test.com',
        },
    ];
    return (
        <div className='ClassStudents'>
            <div className='table'>
                <ul className='thead'>
                    <li className='tr'>
                        <p className='th'>User ID</p>
                        <p className='th'>Name</p>
                        <p className='th'>Email</p>
                        <p className='th'>Date Joined</p>
                    </li>
                </ul>
                <ul className='tbody'>
                    {students.map((item, i) => (
                        <li className='tr'>
                            <p className='td'>{item.userID + i}</p>
                            <p className='td'>{item.name}</p>
                            <p className='td'>{item.email}</p>
                            <p className='td'>{item.dateJoined}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ClassStudents;
