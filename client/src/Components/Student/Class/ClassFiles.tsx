import { useEffect, useState } from "react";
import { useClass } from "../../../Components/Context/ClassContext";
import { useCurrUser } from "../../../Components/Context/UserContext";
import { Quizzes, Quiz } from "../../Interface/Quiz";
import {
  getQuizResults,
  getQuizzesByClassId,
} from "../../../apiCalls/QuizAPIs";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../../Components/Context/QuizContext";
import { SyncLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { StudentImageResult } from "../../Interface/Quiz";
import "react-toastify/dist/ReactToastify.css";

const ClassFiles = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quizzes[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<StudentImageResult[]>([]);
  const { clickedClass } = useClass();
  const { user } = useCurrUser();
  const { setSelectedQuiz } = useQuiz();

  useEffect(() => {
    const fetchQuizData = async () => {
      if (clickedClass?.classid) {
        try {
          const quiz: Quiz[] = await getQuizzesByClassId(clickedClass.classid);

          const quizzesWithProperMapping: Quizzes[] = quiz.map((q) => ({
            quizId: q.quizid,
            quizName: q.quizname,
          }));
          setQuizzes(quizzesWithProperMapping);

          if (user?.userid) {
            const results = await Promise.all(
              quizzesWithProperMapping.map(async (q) => {
                try {
                  const result = await getQuizResults(user.userid, q.quizId);
                  return result;
                } catch (err) {
                  return null;
                }
              })
            );

            const filteredResults = results.filter(
              (result): result is StudentImageResult => result !== null
            );
            setQuizResults(filteredResults);
            console.log("Fetched quiz results:", filteredResults);
          }
        } catch (err) {
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizData();
  }, [clickedClass, user]);

  const mapQuizzesToQuiz = (quiz: Quizzes): Quiz => ({
    quizid: quiz.quizId,
    classid: clickedClass?.classid || "",
    quizname: quiz.quizName,
    teacherid: user?.userid || "",
    quizanswerkey: [],
  });

  const handleClick = (quiz: Quizzes) => {
    const selectedQuiz = mapQuizzesToQuiz(quiz);
    setSelectedQuiz(selectedQuiz);
    navigate("/dashboard/class/quiz/quiz-result");
  };

  const handleViewQuiz = (
    event: React.MouseEvent<HTMLButtonElement>,
    quiz: Quizzes
  ) => {
    event.stopPropagation();
    const selectedQuiz = mapQuizzesToQuiz(quiz);
    setSelectedQuiz(selectedQuiz);
    navigate("/dashboard/class/quiz/quiz-result");
  };

  const handleEditQuiz = (
    event: React.MouseEvent<HTMLButtonElement>,
    quiz: Quizzes
  ) => {
    event.stopPropagation();
    const selectedQuiz = mapQuizzesToQuiz(quiz);
    setSelectedQuiz(selectedQuiz);
    navigate("/dashboard/class/quiz/quiz-result-edit");
  };

  const displayedQuizzes = new Set();

  return (
    <div className="Classes">
      {loading ? (
        <div className="loader">
          <SyncLoader color="#416edf" />
        </div>
      ) : (
        <div className="table">
          <div className="thead">
            <div className="tr">
              <p className="td">Quiz Name</p>
              <p className="td">Score</p>
              <p className="td"></p>
              <p className="td" style={{ marginLeft: "30px" }}>
                Action
              </p>
            </div>
          </div>
          <div className="tbody">
            {quizzes.length > 0 ? (
              quizzes.map((quiz, i) => {
                if (displayedQuizzes.has(quiz.quizId)) {
                  return null;
                }

                displayedQuizzes.add(quiz.quizId);

                const result = quizResults.find(
                  (r) => r.quizid === quiz.quizId
                );
                const status = result
                  ? result.editedstatus
                  : "Not Yet Uploaded";
                const score = result ? result.finalscore : "N/A";
                return (
                  <div className="tr" onClick={() => handleClick(quiz)} key={i}>
                    <p className="td">{quiz.quizName}</p>
                    <p className="td">{score}</p>
                    <p className="td">{status === "NONE" ? "" : status}</p>
                    <p className="td">
                      <div>
                        <button
                          className="view"
                          onClick={(event) => handleViewQuiz(event, quiz)}
                        >
                          View
                        </button>
                        {status === "NONE" ? (
                          <button
                            className="edit"
                            onClick={(event) => handleEditQuiz(event, quiz)}
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            className="edit"
                            onClick={(event) => {
                              event.stopPropagation();
                              toast(
                                "This quiz has pending approval or not processed, you can't edit more than once."
                              );
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="no-data-row">
                <div className="no-data-content">
                  <p className="empty-state">
                    There are no quizzes in this class yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ClassFiles;
