import React, { useEffect, useState } from 'react';
import Header from '../../../Common/Header';
import Gradients from '../../../Common/Gradients';
import SmilingRobot from '../../../Common/SmilingRobot';
import { getAllQuizScores } from '../../../../apiCalls/QuizAPIs';
import { useQuiz } from '../../../Context/QuizContext';
import { StudentQuiz } from '../../../Interface/Quiz';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';

const Quiz = () => {
    const navigate = useNavigate();
    const [studentsWithScores, setStudentsWithScores] = useState<StudentQuiz[]>(
        [],
    );
    const { selectedQuiz, setSelectedStudentResult } = useQuiz();

    useEffect(() => {
        if (selectedQuiz?.quizid) {
            getAllQuizScores(selectedQuiz.quizid)
                .then((student) => {
                    const valuesOfA = Object.values(student);
                    valuesOfA.sort((a, b) => {
                        const nameA = `${a.firstName} ${a.lastName}`.toUpperCase();
                        const nameB = `${b.firstName} ${b.lastName}`.toUpperCase();
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    });
                    setStudentsWithScores(valuesOfA);
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    }, [selectedQuiz]);

    const handleViewStudentScore = (student: StudentQuiz) => {
        setSelectedStudentResult(student);
        navigate('/dashboard/class/quiz/quiz-result');
    };

    const handleDownloadExcel = () => {
        const data = studentsWithScores.map(student => ({
            'Student Name': `${student.firstName} ${student.lastName}`,
            'Score': student.score,
        }));
        
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Scores');
        XLSX.writeFile(workbook, 'StudentScores.xlsx');
    };

    return (
        <div className='Quiz Main MainContent'>
            <Header />

            <main>
                <div className='btn-container'>
                    <div>
                        <button>Class Files</button>
                        <button>Analysis</button>
                    </div>
                    <div className='upload-download'>
                        <button>Upload</button>
                        <button onClick={handleDownloadExcel}>Download Excel</button>
                    </div>
                </div>
                <div className='table'>
                    <ul className='thead'>
                        <li className='th'>
                            <p className='td'>Student Name</p>
                            <p className='td'>Scores</p>
                            <p className='td'>Actions</p>
                        </li>
                    </ul>
                    <ul className='tbody'>

                        {studentsWithScores.map((student, i) => (
                            <li key={i} className='tr'>
                                <p className='td'>
                                    {student.firstName} {student.lastName}
                                </p>
                                <p className='td'>{student.score}</p>
                                <div>
                                    <button
                                        className='view'
                                        onClick={() =>
                                            handleViewStudentScore(student)
                                        }
                                    >
                                        View
                                    </button>
                                    <button className='edit'>Edit</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>

            <SmilingRobot />
            <Gradients />
            <ToastContainer/>
        </div>
    );
};

export default Quiz;
