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
import {
  saveStudentQuiz,
  getAllActivityLogs,
} from "../../../../apiCalls/studentQuizApi";
import { SyncLoader } from "react-spinners";
import ConfirmationModal from "../../../Modal/ConfirmationModal";
import { useCurrUser } from "../../../Context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

interface AnswerMap {
  [key: number]: {
    answer: string;
    correct: boolean;
};
}

interface EditedAnswer {
  itemnumber: number;
  editeditem: string;
  isapproved: boolean;
  isdisapproved: boolean;
  isedited: boolean;
}

const QuizResultEdit = () => {
  const [answers, setAnswers] = useState<
    { itemnumber: number; answer: string }[]
  >([]);
  const [studentAnswers, setStudentAnswers] = useState<AnswerMap>({});
  const [studentQuizId, setStudentQuizId] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [bonusScore, setBonusScore] = useState(0);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const { user } = useCurrUser();
  const [editedAnswers, setEditedAnswers] = useState<{
    [key: number]: EditedAnswer;
  }>({});
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingAnswer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [ismodalloading, setModalLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedStudentResult?.userId && selectedQuiz?.quizid) {
      getQuizResults(selectedStudentResult.userId, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.comment || "");
          setBonusScore(result.bonusscore || 0);
          setStudentQuizId(result.studentquizid || "");
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
            itemnumber: curr.itemnumber,
            editeditem: curr.editeditem,
            isapproved: curr.isapproved,
            isdisapproved: curr.isdisapproved,
            isedited: curr.isedited,
          };
          return acc;
        },
        {} as { [key: number]: EditedAnswer }
      );
      setEditedAnswers(extractedEditedAnswers);

      setEditedStatus(studentResult?.editedstatus || "");
    }
  }, [studentResult]);

  useEffect(() => {
    if (studentResult?.recognizedAnswers) {
      const answersMap = studentResult.recognizedAnswers.reduce(
          (acc: { [key: number]: { answer: string; correct: boolean } }, answerObj) => {
              acc[answerObj.itemnumber] = {
                  answer: answerObj.answer,
                  correct: answerObj.correct,
              };
              return acc;
          },
          {}
      );
      setStudentAnswers(answersMap);
  }

    if (selectedQuiz?.quizanswerkey) {
      setAnswers(selectedQuiz.quizanswerkey);
    }
    if (selectedQuiz?.dueDateTime) {
      setDueDate(formatDueDate(selectedQuiz.dueDateTime));
    }
  }, [selectedQuiz, studentResult]);

  const handleFetchLogs = async () => {
    if (showModal) {
      setShowModal(false);
      return;
    }
    try {
      const response = await getAllActivityLogs(studentQuizId);
      if (response && Array.isArray(response.logs)) {
        setLogs(response.logs); 
        setShowModal(true);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      toast.error("Error fetching logs");
    }
  };

  const formatDueDate = (dueDateTime: string): string => {
    const date = new Date(dueDateTime);

    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date
      .toLocaleTimeString(undefined, timeOptions)
      .replace(":00 ", " ");

    return `${formattedDate} | ${formattedTime}`;
  };

  const handleClose = () => {
    navigate("/dashboard/class/quiz");
  };

  const handleStudentAnswerChange = (index: number, value: string) => {
    const updatedAnswers = {
      ...editedAnswers,
      [index]: { ...editedAnswers[index], editeditem: value },
    };
    setEditedAnswers(updatedAnswers);
    setEditedStatus("PENDING");
  };

  const handleSaveClick = () => {
    if (isEditingAnswer) {
      setIsModalOpen(true);
    } else {
      confirmSave();
    }
  };

  const confirmSave = async () => {
    setIsModalOpen(false);
    try {
      setIsSaving(true);
      setModalLoading(true);
      if (
        editedStatus !== "PENDING" &&
        Object.keys(editedAnswers).some((key) => {
          const studentAnswer = studentAnswers[parseInt(key)];
          const editedAnswer = editedAnswers[parseInt(key)].editeditem;
    
          return studentAnswer.answer !== editedAnswer;
        })
      ) {
        setEditedStatus("PENDING");
      }

      if (!user?.userid) {
        throw new Error("User ID is undefined");
      }

      if (studentQuizId) {
        const formattedAnswers = Object.keys(editedAnswers)
          .map((key) => {
            const answer = editedAnswers[parseInt(key)];
            return `${key}. ${answer.editeditem}`;
          })
          .join("\n");
        await saveStudentQuiz(
          studentQuizId,
          user.userid,
          formattedAnswers,
          feedback,
          bonusScore,
          editedStatus
        );
        toast.success("Successfully saved changes!");
        navigate("/dashboard/class/quiz");
      } else {
        toast.error("Quiz ID is required.");
      }
    } catch (error) {
      toast.error("Error saving changes");
    } finally {
      setIsSaving(false);
      setModalLoading(false);
    }
  };

  const handleBonusScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(e.target.value);
    setBonusScore(score);
  };

  const renderRows = () => {
    const rows = [];
    const maxItemNumber = Math.max(
      ...answers.map((ans) => ans.itemnumber),
      ...Object.keys(studentAnswers).map((key) => parseInt(key))
    );

    for (let i = 1; i <= maxItemNumber; i++) {
      const studentAnswer = studentAnswers[i] || "";
      const correctAnswer = answers[i - 1]?.answer || "";
      const editedAnswerObj = editedAnswers[i] || {
        editeditem: "",
        isedited: false,
        isapproved: false,
        isdisapproved: false,
      };

      let highlightClass = "";

      if (editedStatus === "NONE") {
        highlightClass = "";
      } else if (editedAnswerObj.isapproved) {
        highlightClass = "highlight-approved";
      } else if (editedAnswerObj.isdisapproved) {
        highlightClass = "highlight-disapproved";
      } else if (editedAnswerObj.isedited) {
        highlightClass = "highlight-edited";
      }

      const isDisabled = highlightClass !== "";
      const hasCorrectAnswer = correctAnswer !== "";

      rows.push(
        <li key={i} className="tr">
          <p className="td"></p>
          <p className="td">{i} {studentAnswers[i - 1]?.correct ? "✔️" : "❌"}</p>
          <p className="td">{studentAnswer.answer}</p>
          <p className="td">
            {hasCorrectAnswer ? (
              <input
                type="text"
                className={`${highlightClass}`}
                value={editedAnswerObj.editeditem}
                onChange={(e) => handleStudentAnswerChange(i, e.target.value)}
                disabled={isDisabled}
              />
            ) : (
              <span></span>
            )}
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
              <h5>
                <i>{dueDate}</i>
              </h5>
              <div className="score-container">
                <h3 className="score">Score: {selectedStudentResult?.score}</h3>
                <div className="additional-points">
                  <h3>
                    <span>Bonus Points:</span>
                    <input
                      style={{ marginLeft: "10px" }}
                      type="number"
                      value={bonusScore}
                      onChange={handleBonusScoreChange}
                    />
                    <FontAwesomeIcon
                      icon={faBell}
                      className="notification-icon"
                      onClick={handleFetchLogs}
                    />
                  </h3>
                </div>
              </div>
            </div>

            <div className="main-results">
              <div className="image-feedback-container">
                <img
                  src={`data:image/png;base64,${studentResult?.base64Image}`}
                  alt=""
                />
                <div className="feedback-container">
                  <textarea
                    placeholder="Provide feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
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
              </div>
            </div>
            <div className="center-button">
              <button
                className="save"
                onClick={handleSaveClick}
                disabled={isSaving}
              >
                {isSaving ? <SyncLoader size={6} color="#fff" /> : "Save"}
              </button>
              <button className="cancel" onClick={handleClose}>
                Cancel
              </button>
            </div>
            <ConfirmationModal
              isOpen={isModalOpen}
              onConfirm={confirmSave}
              onCancel={() => setIsModalOpen(false)}
              message="Are you sure you want to edit? You can only edit once."
              loading={ismodalloading}
            />
          </>
        )}
      </main>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <ul>
              <h4 style={{ marginBottom: "10px" }}>
                <i>Logs</i>
              </h4>
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: "15px", fontSize: "12px" }}
                  >
                    <i>{log}</i>
                  </li>
                ))
              ) : (
                <li>No logs available</li>
              )}
            </ul>
          </div>
        </div>
      )}

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default QuizResultEdit;
