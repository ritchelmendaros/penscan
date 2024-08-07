import { useEffect, useState } from 'react';
import Thumbnail from '../../../Components/Common/Thumbnail';
import { useClass } from '../../../Components/Context/ClassContext';
import { useCurrUser } from '../../../Components/Context/UserContext';
import { Quizzes } from '../../Interface/Quiz';
import { getQuizNamesByUserIdAndClassId, getAnswerKey } from '../../../apiCalls/QuizAPIs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../../Components/Context/QuizContext';


const ClassFiles = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quizzes[]>([]);

    const { clickedClass } = useClass();
    const { user } = useCurrUser();
    const { setSelectedQuiz } = useQuiz();

    useEffect(() => {
        console.log(clickedClass?.classid);
        console.log(user?.userid);

        if (user?.userid && clickedClass?.classid) {
            getQuizNamesByUserIdAndClassId(user.userid, clickedClass.classid)
                .then((quiz) => {
                    setQuizzes(quiz);
                    console.log(quiz);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [clickedClass, user]);

    const handleClick = (quiz: Quizzes) => {
        setSelectedQuiz(quiz);
        navigate('/dashboard/class/quiz/quiz-result');
    };

    return (
        <div className='Classes'>
            <ul>
                {quizzes.length > 0 ? (
                    quizzes.map((quiz, i) => (
                        <li onClick={() => handleClick(quiz)} key={i}>
                            <Thumbnail name={quiz.quizName}/>
                            {/* <h2>{quiz.quizName}</h2> */}
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