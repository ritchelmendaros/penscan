import { useEffect, useState } from 'react';
import Thumbnail from '../../../Common/Thumbnail';
import { useClass } from '../../../Context/ClassContext';
import { useCurrUser } from '../../../Context/UserContext';
import { Quiz } from '../../../Interface/Quiz';
import { getAllQuizes } from '../../../../apiCalls/QuizAPIs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../../Context/QuizContext';

const ClassFiles = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const { clickedClass } = useClass();
    const { user } = useCurrUser();
    const { setSelectedQuiz } = useQuiz();

    useEffect(() => {
        console.log(clickedClass?.classid);
        console.log(user?.userid);

        if (user?.userid && clickedClass?.classid) {
            getAllQuizes(user.userid, clickedClass.classid)
                .then((quiz) => {
                    setQuizzes(quiz);
                    console.log(quiz);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [clickedClass, user]);

    const handleClick = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        navigate('/dashboard/class/quiz');
    };

    return (
        <div className='ClassFiles'>
            <ul>
                {quizzes.length > 0 ? (
                    quizzes.map((quiz, i) => (
                        <li onClick={() => handleClick(quiz)} key={i}>
                            <Thumbnail />
                            <p>{quiz.quizname}</p>
                        </li>
                    ))
                ) : (
                    <h1 className='empty-state'>
                        There are no quizzes in this class yet.
                    </h1>
                )}
            </ul>
        </div>
    );
};

export default ClassFiles;
