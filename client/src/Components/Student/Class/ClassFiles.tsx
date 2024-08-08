import { useEffect, useState } from 'react';
import Thumbnail from '../../../Components/Common/Thumbnail';
import { useClass } from '../../../Components/Context/ClassContext';
import { useCurrUser } from '../../../Components/Context/UserContext';
import { Quizzes } from '../../Interface/Quiz';
import { getQuizNamesByUserIdAndClassId, getAnswerKey } from '../../../apiCalls/QuizAPIs';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../../Components/Context/QuizContext';
import { SyncLoader } from 'react-spinners';


const ClassFiles = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Quizzes[]>([]);
    const [loading, setLoading] = useState(true);

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
                    setLoading(false);
                    // console.log(quiz);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [clickedClass, user]);

    const handleClick = (quiz: Quizzes) => {
        setSelectedQuiz(quiz);
        navigate('/dashboard/class/quiz/quiz-result');
    };

    return (
        <div className='Classes'>
            {loading ? (
                <div className='loader'>
                    <SyncLoader color='#416edf'/>
                </div>
            ) : (
                <ul>
                    {quizzes.length > 0 ? (
                        quizzes.map((quiz, i) => (
                            <li onClick={() => handleClick(quiz)} key={i}>
                                <Thumbnail name={quiz.quizName} />
                            </li>
                        ))
                    ) : (
                        <h1 className='empty-state'>
                            There are no quizzes in this class yet.
                        </h1>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ClassFiles;