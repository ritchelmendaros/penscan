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
  // const [editedAnswers, setEditedAnswers] = useState<{ [key: number]: string }>(
  //   {}
  // );
  const [editedAnswers, setEditedAnswers] = useState<{ [key: number]: { editeditem: string; isapproved: boolean; isdisapproved: boolean } }>({});
  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedStudentResult?.userId && selectedQuiz?.quizid) {
      getQuizResults(selectedStudentResult.userId, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.comment || "No feedback given");
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  }, [selectedStudentResult, selectedQuiz]);

  useEffect(() => {
    // if (studentResult?.editedanswer) {
    //   const extractedAnswers = extractAnswers(studentResult.editedanswer);
    //   setEditedAnswers(extractedAnswers);
    // }
    if (studentResult?.editedanswer && Array.isArray(studentResult.editedanswer)) { 
      const extractedEditedAnswers = studentResult.editedanswer.reduce((acc, curr, index) => {
        acc[index + 1] = { editeditem: curr.editeditem, isapproved: curr.isapproved, isdisapproved: curr.isdisapproved };
        return acc;
      }, {} as { [key: number]: { editeditem: string; isapproved: boolean; isdisapproved: boolean } });
      setEditedAnswers(extractedEditedAnswers);
    }
  }, [studentResult]);

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
      const editedAnswer = editedAnswers[i]?.editeditem || "";
      const correctAnswer = answers[correctIndex] || "Skipped";

      const isEditedDifferent =
        editedAnswer !== "" &&
        editedAnswer !== studentAnswer &&
        editedAnswer !== correctAnswer;

      rows.push(
        <li key={i} className="tr">
          <p className="td"></p>
          <p className="td">{i}</p>
          <p className="td">{studentAnswer || ""}</p>
          <p className={`td ${isEditedDifferent ? "highlight-edited" : ""}`}>
          {isEditedDifferent ? editedAnswer : ""}
        </p>
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
              <div className="score-container">
                <h3>Score: {selectedStudentResult?.score}</h3>
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
            <div className="viewcenter-button">
              <button className="viewapprove" onClick={handleClose}>
                Approve
              </button>
              <button className="viewdisapprove" onClick={handleClose}>
                Disapprove
              </button>
              <button className="viewclose" onClick={handleClose}>
                Close
              </button>
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
