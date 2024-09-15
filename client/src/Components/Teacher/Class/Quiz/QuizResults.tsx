import Header from "../../../Common/Header";
import Gradients from "../../../Common/Gradients";
import SmilingRobot from "../../../Common/SmilingRobot";
import { useQuiz } from "../../../Context/QuizContext";
import { useEffect, useState } from "react";
import { getQuizResults } from "../../../../apiCalls/QuizAPIs";
import { StudentImageResult } from "../../../Interface/Quiz";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const QuizResults = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedStudentResult?.userId && selectedQuiz?.quizid) {
      getQuizResults(selectedStudentResult.userId, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.feedback || "No feedback given");
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  }, [selectedStudentResult, selectedQuiz]);

  const extractAnswers = (input: string) => {
    const answers: { [key: number]: string } = {};
    input
      .trim()
      .split("\n")
      .forEach((line) => {
        const match = line.match(/^(\d+)\.\s*(.*)$/);
        if (match) {
          const number = parseInt(match[1]);
          const answer = match[2];
          answers[number] = answer;
        }
      });
    return answers;
  };

  useEffect(() => {
    if (studentResult?.recognizedtext) {
      setStudentAnswers(extractAnswers(studentResult.recognizedtext));
    }

    if (selectedQuiz?.quizanswerkey) {
      const correctAnswers = extractAnswers(selectedQuiz.quizanswerkey);
      setAnswers(Object.values(correctAnswers));
    }
  }, [selectedQuiz, studentResult]);

  const handleClose = () => {
    navigate("/dashboard/class/quiz");
  };

  const renderRows = () => {
    const rows = [];
    let correctIndex = 0;

    for (let i = 1; i <= answers.length; i++) {
      const studentAnswer = studentAnswers[i];
      const correctAnswer = answers[correctIndex] || "Skipped";

      rows.push(
        <li key={i} className="tr">
          <p className="td"></p>
          <p className="td">{i}</p>
          <p className="td">{studentAnswer || ""}</p>
          <p className="td">{studentAnswer || ""}</p>
          <p className="td">{correctAnswer}</p>
          <p className="td"></p>
        </li>
      );

      correctIndex++;
    }

    return rows;
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
                  {selectedStudentResult?.firstName}{" "}
                  {selectedStudentResult?.lastName}
                </h3>
              </div>
              <h3>Score: {selectedStudentResult?.score}</h3>
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
                    <textarea readOnly value={feedback || ""} />
                  </div>
                )}
              </div>

              <div className="table">
                <ul className="thead">
                  <li className="th">
                    <p />
                    <p className="td">Item </p>
                    <p className="td">Scanned Answer</p>
                    <p className="td">Edited Answer</p>
                    <p className="td">Correct Answer</p>
                    <p />
                  </li>
                </ul>
                <ul className="tbody">{renderRows()}</ul>
              </div>
            </div>
            <div className="center-button">
              <button onClick={handleClose}>Close</button>
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

export default QuizResults;
