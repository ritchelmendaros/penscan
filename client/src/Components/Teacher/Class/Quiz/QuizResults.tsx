import Header from "../../../Common/Header";
import Gradients from "../../../Common/Gradients";
import SmilingRobot from "../../../Common/SmilingRobot";
import { useQuiz } from "../../../Context/QuizContext";
import { useEffect, useState } from "react";
import { getQuizResults } from "../../../../apiCalls/QuizAPIs";
import {
  approveQuizAnswer,
  disapproveQuizAnswer,
} from "../../../../apiCalls/studentQuizApi";
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
  const [editedAnswers, setEditedAnswers] = useState<{
    [key: number]: {
      itemnumber: number;
      editeditem: string;
      isapproved: boolean;
      isdisapproved: boolean;
      isedited: boolean;
    };
  }>({});
  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

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
        {}
      );

      setEditedAnswers(extractedEditedAnswers);
    }
  }, [studentResult]);

  const handleApprove = async () => {
    if (
      !studentResult ||
      !selectedStudentResult?.userId ||
      !selectedQuiz?.quizid
    ) {
      return;
    }

    const updatedAnswers = { ...editedAnswers };

    for (const itemIndex of selectedItems) {
      if (updatedAnswers[itemIndex]) {
        try {
          await approveQuizAnswer(
            studentResult.studentquizid,
            selectedStudentResult?.userId!,
            selectedQuiz?.quizid!,
            itemIndex,
            updatedAnswers[itemIndex].editeditem
          );

          updatedAnswers[itemIndex].isapproved = true;
          updatedAnswers[itemIndex].isdisapproved = false;
        } catch (error) {
          toast.error("Error approving item " + itemIndex);
        }
      }
    }

    setEditedAnswers(updatedAnswers);
    setSelectedItems([]);
    toast.success("Selected items approved!");
  };

  const handleDisapprove = async () => {
    if (
      !studentResult ||
      !selectedStudentResult?.userId ||
      !selectedQuiz?.quizid
    ) {
      toast.error("Missing required data for disapproval.");
      return;
    }

    const updatedAnswers = { ...editedAnswers };

    for (const itemIndex of selectedItems) {
      if (updatedAnswers[itemIndex]) {
        try {
          await disapproveQuizAnswer(
            studentResult.studentquizid,
            selectedStudentResult?.userId!,
            selectedQuiz?.quizid!,
            itemIndex,
            updatedAnswers[itemIndex].editeditem
          );
          updatedAnswers[itemIndex].isapproved = false;
          updatedAnswers[itemIndex].isdisapproved = true;
        } catch (error) {
          console.error("Error disapproving item " + itemIndex, error);
          toast.error("Error disapproving item " + itemIndex);
        }
      }
    }

    setEditedAnswers(updatedAnswers);
    setSelectedItems([]);
  };

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

  const handleCheckboxChange = (itemIndex: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(itemIndex)
        ? prevSelected.filter((index) => index !== itemIndex)
        : [...prevSelected, itemIndex]
    );
  };

  const renderRows = () => {
    const rows = [];

    for (let i = 1; i <= answers.length; i++) {
      const studentAnswer = studentAnswers[i] || "";
      const correctAnswer = answers[i - 1] || "Skipped"; 
      const editedStatus = studentResult?.editedstatus;

      const editedAnswerObj = editedAnswers[i] || null;
      let editedAnswer =
        editedAnswerObj && editedAnswerObj.isedited
          ? editedAnswerObj.editeditem
          : "";

      const isEditedDifferent =
        editedAnswer !== "" &&
        editedAnswer !== studentAnswer &&
        editedAnswer !== correctAnswer;

      let highlightClass = "";
      if (editedStatus === "NONE") {
        highlightClass = "";
      } else if (editedAnswerObj?.isapproved) {
        highlightClass = "highlight-approved";
      } else if (editedAnswerObj?.isdisapproved) {
        highlightClass = "highlight-disapproved";
      } else if (isEditedDifferent) {
        highlightClass = "highlight-edited";
      }

      rows.push(
        <li key={i} className="tr">
          <p className="td">
            {editedStatus !== "NONE" && isEditedDifferent && (
              <input
                type="checkbox"
                checked={selectedItems.includes(i)}
                onChange={() => handleCheckboxChange(i)}
              />
            )}
          </p>
          <p className="td">{i}</p>
          <p className="td">{studentAnswer}</p>
          <p className={`td ${highlightClass}`}>
            {editedStatus !== "NONE" && editedAnswer ? editedAnswer : ""}
          </p>
          <p className="td">{correctAnswer}</p>
          <p className="td"></p>
        </li>
      );
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
                  <li className="thview">
                    <p />
                    <p className="tdview">Item </p>
                    <p className="tdview">Scanned Answer</p>
                    <p className="tdview">Edited Answer</p>
                    <p className="tdview">Correct Answer</p>
                    <p />
                  </li>
                </ul>
                <ul className="tbody">{renderRows()}</ul>
              </div>
            </div>
            <div className="viewcenter-button">
              <button className="viewapprove" onClick={handleApprove}>
                Approve
              </button>
              <button className="viewdisapprove" onClick={handleDisapprove}>
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
