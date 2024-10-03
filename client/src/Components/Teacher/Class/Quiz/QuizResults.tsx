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
  const [answers, setAnswers] = useState<
    { itemnumber: number; answer: string }[]
  >([]);

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
  const [refresh, setRefresh] = useState(0);

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
  }, [selectedStudentResult, selectedQuiz, refresh]);

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
    setRefresh((prev) => prev + 1);
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
          toast.error("Error disapproving item " + itemIndex);
        }
      }
    }

    setEditedAnswers(updatedAnswers);
    setSelectedItems([]);
    setRefresh((prev) => prev + 1);
  };

  useEffect(() => {
    if (studentResult?.recognizedAnswers) {
      const answersMap = studentResult.recognizedAnswers.reduce(
        (acc: { [key: number]: string }, answerObj) => {
          acc[answerObj.itemnumber] = answerObj.answer;
          return acc;
        },
        {}
      );
      setStudentAnswers(answersMap);
    }

    if (selectedQuiz?.quizanswerkey) {
      setAnswers(selectedQuiz.quizanswerkey);
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
    const totalItems = Math.max(
      answers.length,
      Object.keys(studentAnswers).length
    );
    const rows = [];

    for (let i = 1; i <= totalItems; i++) {
      const studentAnswer = studentAnswers[i] || "";
      const correctAnswer = answers[i - 1]?.answer || "";
      const editedStatus = studentResult?.editedstatus;

      const editedAnswerObj = editedAnswers[i] || null;
      let editedAnswer =
        editedAnswerObj && editedAnswerObj.isedited
          ? editedAnswerObj.editeditem
          : "";

      const isEditedDifferent =
        editedAnswer !== "" && editedAnswer !== studentAnswer;

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
            {editedStatus !== "NONE" &&
              !editedAnswerObj?.isapproved &&
              !editedAnswerObj?.isdisapproved &&
              isEditedDifferent && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(i)}
                  onChange={() => handleCheckboxChange(i)}
                />
              )}
          </p>
          <p className="td">{i}</p>
          <p className="td">{studentAnswer}</p>
          <p className={`td ${highlightClass}`}>{editedAnswer || ""}</p>

          <p className="td">{correctAnswer}</p>
          <p className="td"></p>
        </li>
      );
    }

    return rows;
  };

  const data = [
    {
      id: 1,
      question: "1",
      scannedAnswer: "Paris",
      editedAnswer: "Paris",
      correctAnswer: "Paris",
      approval: "Accept",
    },
    {
      id: 2,
      question: "2",
      scannedAnswer: "Shakespeare",
      editedAnswer: "William Shakespeare",
      correctAnswer: "William Shakespeare",
      approval: "Accept",
    },
    {
      id: 3,
      question: "3",
      scannedAnswer: "5",
      editedAnswer: "4",
      correctAnswer: "4",
      approval: "Reject",
    },
  ];
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

              <div className="question-answer-table">
                <table>
                  <thead>
                    <tr>
                      <th>Question</th>
                      <th>Approval</th>
                      <th>Scanned Answer</th>
                      <th>Edited Answer</th>
                      <th>Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => (
                      <tr key={row.id}>
                        <td>{row.question}</td>
                        <td>
                          <div className="approval-buttons">
                            <button
                              className={`btn ${
                                row.approval === "Accept"
                                  ? "btn-primary"
                                  : "btn-outline"
                              }`}
                            >
                              Accept
                            </button>
                            <button
                              className={`btn ${
                                row.approval === "Reject"
                                  ? "btn-danger"
                                  : "btn-outline"
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                        <td>{row.scannedAnswer}</td>
                        <td>{row.editedAnswer}</td>
                        <td>{row.correctAnswer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
