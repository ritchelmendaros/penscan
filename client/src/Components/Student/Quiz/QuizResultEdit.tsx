import Header from "../../Common/Header";
import Gradients from "../../Common/Gradients";
import SmilingRobot from "../../Common/SmilingRobot";
import { useQuiz } from "../../Context/QuizContext";
import { useClass } from "../../../Components/Context/ClassContext";
import { useEffect, useState } from "react";
import { getQuizResults, getAnswerKey } from "../../../apiCalls/QuizAPIs";
import { StudentImageResult } from "../../Interface/Quiz";
import { useCurrUser } from "../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

interface Answer {
  itemnumber: number;
  answer: string;
}

const StudentQuizResultEdit = () => {
  const navigate = useNavigate();
  const { clickedClass } = useClass();
  const [correctAnswers, setCorrectAnswers] = useState<Answer[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<Answer[]>([]);
  const [editedAnswers, setEditedAnswers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string>("No feedback given");
  const { user } = useCurrUser();
  const { selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userid && selectedQuiz?.quizid) {
      setLoading(true);
      getQuizResults(user?.userid, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.comment || "No feedback given");
          return getAnswerKey(selectedQuiz.quizid);
        })
        .then((answerKey) => {
          const parsedAnswerKey =
            typeof answerKey === "string" ? JSON.parse(answerKey) : answerKey;
          setCorrectAnswers(parsedAnswerKey);
        })
        .catch((error) => {
          toast.error("Error fetching data", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, selectedQuiz]);

  useEffect(() => {
    if (
      studentResult?.editedanswer &&
      Array.isArray(studentResult.editedanswer)
    ) {
      const extractedEditedAnswers = studentResult.editedanswer.reduce(
        (acc, curr) => {
          acc[curr.itemnumber] = {
            editeditem: curr.editeditem,
            isapproved: curr.isapproved,
            isdisapproved: curr.isdisapproved,
            isedited: curr.isedited,
          };
          return acc;
        },
        {} as Record<number, any>
      );

      setEditedAnswers(extractedEditedAnswers);
    }
  }, [studentResult]);

  useEffect(() => {
    if (studentResult?.recognizedAnswers) {
      const extractedAnswers = studentResult.recognizedAnswers.map(
        (recognizedAnswer) => ({
          itemnumber: recognizedAnswer.itemnumber,
          answer: recognizedAnswer.answer,
        })
      );
      setStudentAnswers(extractedAnswers);
    }
  }, [studentResult]);

  const renderRows = () => {
    return correctAnswers.map((correctAnswer) => {
      const studentAnswer = studentAnswers.find(
        (ans) => ans.itemnumber === correctAnswer.itemnumber
      ) || { answer: "" };
      const defaultEditedAnswer = {
        editeditem: "",
        isapproved: false,
        isdisapproved: false,
      };
      const editedAnswerObj =
        editedAnswers[correctAnswer.itemnumber] || defaultEditedAnswer;

      const editedStatus = studentResult?.editedstatus;

      let editedItem = editedAnswerObj.isedited
        ? editedAnswerObj.editeditem
        : "";

      let highlightClass = "";

      if (editedStatus === "NONE") {
        highlightClass = "";
      } else if (editedAnswerObj.isapproved) {
        highlightClass = "highlight-approved";
      } else if (editedAnswerObj.isdisapproved) {
        highlightClass = "highlight-disapproved";
      } else if (
        !editedAnswerObj.isdisapproved &&
        !editedAnswerObj.isapproved &&
        editedAnswerObj.isedited
      ) {
        highlightClass = "highlight-edited";
      }

      const isDisabled = highlightClass !== "";

      return (
        <li key={correctAnswer.itemnumber} className="tr">
          <p className="td"></p>
          <p className="td">{correctAnswer.itemnumber}</p>
          <p className="td">{studentAnswer.answer}</p>
          <p className={`td ${highlightClass}`}>
            <input
              type="text"
              value={editedAnswerObj.editeditem}
              onChange={(e) => {
                setEditedAnswers((prev) => ({
                  ...prev,
                  [correctAnswer.itemnumber]: e.target.value,
                }));
              }}
              disabled={isDisabled}
            />
          </p>
          <p className="td">{correctAnswer.answer}</p>
          <p className="td"></p>
        </li>
      );
    });
  };

  const handleSave = () => {
    toast("Edit button clicked");
  };

  const handleClose = () => {
    navigate(`/dashboard/class/${clickedClass?.classid}`);
  };

  return (
    <div className="QuizResults Main MainContent">
      <Header />
      <main>
        {loading ? (
          <div className="loader-container">
            <SyncLoader color="#3498db" loading={loading} size={15} />
          </div>
        ) : (
          <>
            <div className="student-details">
              <div>
                <h3>
                  {user?.firstname} {user?.lastname}
                </h3>
              </div>
              <div className="score-container">
                <h3 className="score">Score: {studentResult?.score}</h3>
                <div className="additional-points">
                  <h3>Bonus Points: {studentResult?.bonusscore}</h3>
                </div>
              </div>
            </div>

            <div className="main-results">
              <div className="image-feedback-container">
                <img
                  src={`data:image/png;base64,${studentResult?.base64Image}`}
                  alt=""
                />
                {feedback === "No feedback given" ? (
                  <p className="no-feedback">{feedback}</p>
                ) : (
                  <div className="feedback-container">
                    <p className="no-feedback">{feedback}</p>
                  </div>
                )}
              </div>

              <div className="table">
                <ul className="thead">
                  <li className="th">
                    <p />
                    <p className="td">Item</p>
                    <p className="td">Scanned Answer</p>
                    <p className="td">Edited Answer</p>
                    <p className="td">Correct Answer</p>
                    <p />
                  </li>
                </ul>
                <ul className="tbody">{renderRows()}</ul>
                <div className="buttons-container">
                  <button onClick={handleSave} className="studenteditsave">
                    Save
                  </button>
                  <button onClick={handleClose} className="studenteditclose">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default StudentQuizResultEdit;
