import { useEffect, useState } from 'react';
import Thumbnail from '../../../Common/Thumbnail';
import { useClass } from '../../../Context/ClassContext';
import { useCurrUser } from '../../../Context/UserContext';
import { Quiz } from '../../../Interface/Quiz';
import { getAllQuizes } from '../../../../apiCalls/QuizAPIs';

const ClassFiles = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    const { clickedClass } = useClass();
    const { user } = useCurrUser();

    useEffect(() => {
        console.log(clickedClass?.classid);
        console.log(user?.userid);

        if (user?.userid && clickedClass?.classid) {
            getAllQuizes(user.userid, clickedClass.classid)
                .then((quiz) => {
                    setQuizzes(quiz);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [clickedClass, user]);

    return (
        <div className='ClassFiles'>
            <ul>
                {quizzes.map((quiz, i) => (
                    <li key={i}>
                        <Thumbnail />
                        <p>{quiz.quizname}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassFiles;
