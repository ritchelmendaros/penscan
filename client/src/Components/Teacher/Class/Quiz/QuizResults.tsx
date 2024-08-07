import Header from '../../../Common/Header';
import Gradients from '../../../Common/Gradients';
import SmilingRobot from '../../../Common/SmilingRobot';
import { useQuiz } from '../../../Context/QuizContext';
import { useEffect, useState } from 'react';
import { getQuizResults } from '../../../../apiCalls/QuizAPIs';
import { StudentImageResult } from '../../../Interface/Quiz';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const QuizResults = () => {
    const [answers, setAnswers] = useState<string[]>([]);
    const [studentAnswers, setStudentAnswers] = useState<string[]>([]);

    const { selectedStudentResult, selectedQuiz } = useQuiz();
    const [studentResult, setStudentResult] = useState<StudentImageResult>();

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedStudentResult?.userId && selectedQuiz?.quizid) {
            getQuizResults(selectedStudentResult.userId, selectedQuiz.quizid)
                .then((result) => {
                    setStudentResult(result);
                })
                .catch((error) => {
                    toast.error(error);
                });
        }
    }, [selectedStudentResult, selectedQuiz]);

    const extractAnswers = (input: string) => {
        return input
            .trim()
            .split('\n')
            .map((line) => line.replace(/^\d+\.\s*/, ''));
    };

    useEffect(() => {
        if (studentResult?.recognizedtext) {
            setStudentAnswers(extractAnswers(studentResult?.recognizedtext));
        }

        if (selectedQuiz?.quizanswerkey) {
            const theAnswers = extractAnswers(selectedQuiz.quizanswerkey);
            setAnswers(theAnswers);
        }
    }, [selectedQuiz, studentResult]);

    const handleClose = () => {
        navigate('/dashboard/class/quiz');
    };

    return (
        <div className='QuizResults Main MainContent'>
            <Header />
            <main>
                <div className='student-details'>
                    <div>
                        <h3>
                            {selectedStudentResult?.firstName}{' '}
                            {selectedStudentResult?.lastName}
                        </h3>
                        
                    </div>
                    <h3>Score: {selectedStudentResult?.score}</h3>
                </div>

                <div className='main-results'>
                    <img
                        src={`data:image/png;base64,${studentResult?.base64Image}`}
                        alt=''
                    />
                    
                    <div className='table'>
                        <ul className='thead'>
                            <li className='th'>
                                <p />
                                <p className='td'>Item No.</p>
                                <p className='td'>Scanned Answer</p>
                                <p className='td'>Correct Answer</p>
                                <p />
                            </li>
                        </ul>
                        <ul className='tbody'>
                            {answers.map((item, i) => (
                                <li key={i} className='tr'>
                                    <p className='td'></p>
                                    <p className='td'>{i + 1}</p>
                                    <p className='td'>
                                        {studentAnswers[i + 1]}
                                    </p>
                                    <p className='td'>{item}</p>
                                    <p className='td'></p>
                                </li>
                            ))}
                        </ul>
                        
                    </div>
                </div>
                <div className="center-button">
                    <button onClick={handleClose}>Close</button>
                </div>
            </main>

            <SmilingRobot />
            <Gradients />
            <ToastContainer/>
        </div>
    );
};

export default QuizResults;
