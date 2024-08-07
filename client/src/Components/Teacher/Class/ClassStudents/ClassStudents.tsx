import React, { useEffect, useState } from 'react';
import { fetchStudentsByClassId } from '../../../../apiCalls/studentApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Student {
    userid: string;
    firstname: string;
    lastname: string;
    username: string;
}

interface ClassStudentsProps {
    classId: string; 
}
const ClassStudents: React.FC<ClassStudentsProps> = ({ classId }) => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!classId) return; 
            try {
                const studentsData = await fetchStudentsByClassId(classId);
                const sortedStudents = studentsData.sort((a: Student, b: Student) =>
                    a.lastname.localeCompare(b.lastname)
                );

                setStudents(sortedStudents);
            } catch (error) {
                toast.error('No students found!');
            }
        };

        fetchStudents();
    }, [classId]);

    return (
        <div className='ClassStudents'>
            <div className='table'>
                <ul className='thead'>
                    <li className='tr'>
                        <p className='th'>Lastname</p>
                        <p className='th'>Firstname</p>
                        <p className='th'>Username</p>
                    </li>
                </ul>
                <ul className='tbody'>
                    {students.map((student) => (
                        <li key={student.userid} className='tr'>
                            <p className='td'>{student.lastname}</p>
                            <p className='td'>{`${student.firstname}`}</p>
                            <p className='td'>{student.username}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default ClassStudents;