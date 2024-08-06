import React, { useEffect, useState } from 'react';
import Header from '../../../Common/Header';
import Gradients from '../../../Common/Gradients';
import SmilingRobot from '../../../Common/SmilingRobot';
import { getAllQuizScores } from '../../../../apiCalls/QuizAPIs';
import { useQuiz } from '../../../Context/QuizContext';
import { StudentQuiz } from '../../../Interface/Quiz';
import { useNavigate } from 'react-router-dom';

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
                    setStudentsWithScores(valuesOfA);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [selectedQuiz]);

    const handleViewStudentScore = (student: StudentQuiz) => {
        setSelectedStudentResult(student);
        navigate('/dashboard/class/quiz/quiz-result');
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
                    <button>Upload</button>
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
        </div>
    );
};

export default Quiz;
