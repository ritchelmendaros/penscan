import { useEffect, useState } from "react";
import Thumbnail from "../../../Common/Thumbnail";
import { useClass } from "../../../Context/ClassContext";
import { useCurrUser } from "../../../Context/UserContext";
import { Quiz } from "../../../Interface/Quiz";
import { getAllQuizes } from "../../../../apiCalls/QuizAPIs";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../../Context/QuizContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLocalStorage } from "../../../../Utils/LocalStorage";
import { SyncLoader } from "react-spinners";
import noDataGif from "../../../../assets/nodata.gif";

const ClassFiles = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const { clickedClass } = useClass();
  const { user } = useCurrUser();
  const { setSelectedQuiz } = useQuiz();

  useEffect(() => {
    if (user?.userid && clickedClass?.classid) {
      getAllQuizes(user.userid, clickedClass.classid)
        .then((quiz) => {
          setQuizzes(quiz);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [clickedClass, user]);

  const handleClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);

    setLocalStorage("cid", quiz.classid);
    setLocalStorage("qid", quiz.quizid);
    setLocalStorage("qans", quiz.quizanswerkey);
    setLocalStorage("qname", quiz.quizname);
    setLocalStorage("qtid", quiz.teacherid);

    navigate("/dashboard/class/quiz");
  };

  return (
    <div className="ClassFiles">
      {loading ? (
        <div className="loader-container">
          <SyncLoader color="#3498db" loading={loading} size={15} />
        </div>
      ) : (
        <ul>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, i) => (
              <li onClick={() => handleClick(quiz)} key={i}>
                <Thumbnail name={quiz.quizname} />
              </li>
            ))
          ) : (
            <li className="empty-state">
              <img src={noDataGif} alt="No quizzes available" />
            </li>
          )}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default ClassFiles;
