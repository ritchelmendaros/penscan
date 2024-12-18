import Header from "../../../Common/Header";
import Gradients from "../../../Common/Gradients";
import { useQuiz } from "../../../Context/QuizContext";
import { useEffect, useState } from "react";
import { getQuizResults } from "../../../../apiCalls/QuizAPIs";
import {
  addFeedbackToEditedAnswerPerItem,
  approveQuizAnswer,
  checkQuizAnswer,
  disapproveQuizAnswer,
  getAllActivityLogs,
  saveStudentQuiz,
} from "../../../../apiCalls/studentQuizApi";
import { StudentImageResult } from "../../../Interface/Quiz";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useCurrUser } from "../../../Context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import BackBtn from "../../../Common/BackBtn";

const QuizResults = () => {
  const [answers, setAnswers] = useState<
    { itemnumber: number; answer: string }[]
  >([]);

  const [studentAnswers, setStudentAnswers] = useState<{
    [key: number]: {
      answer: string;
      correct: boolean;
    };
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
      feedback: string[];
      editedby: string;
    };
  }>({});
  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();
  const navigate = useNavigate();
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const { user } = useCurrUser();
  const [studentQuizId, setStudentQuizId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFeedbackPerItemModal, setShowFeedbackPerItemModal] =
    useState(false);
  const [showFeedbackPerItemModalDisplay, setShowFeedbackPerItemModalDisplay] =
    useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [feedbackperitem, setFeedbackPerItem] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAnswer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [bonusScore, setBonusScore] = useState(0);

  useEffect(() => {
    if (selectedStudentResult?.userId && selectedQuiz?.quizid) {
      getQuizResults(selectedStudentResult.userId, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.comment || "No feedback given");
          setStudentQuizId(result.studentquizid);
          setBonusScore(result.bonusscore || 0);
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
            feedback: curr.feedback,
            editedby: curr.editedby,
          };
          return acc;
        },
        {} as {
          [key: number]: {
            itemnumber: number;
            editeditem: string;
            isapproved: boolean;
            isdisapproved: boolean;
            isedited: boolean;
            feedback: string[];
            editedby: string;
          };
        }
      );

      setEditedAnswers(extractedEditedAnswers);
    }
  }, [studentResult]);

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

  const handleApprove = async (itemIndex: number) => {
    if (
      !studentResult ||
      !selectedStudentResult?.userId ||
      !selectedQuiz?.quizid
    ) {
      return;
    }

    if (!user?.userid) {
      throw new Error("User ID is undefined");
    }

    const answerToSubmit = editedAnswers[itemIndex]?.editeditem
      ? editedAnswers[itemIndex].editeditem
      : studentAnswers[itemIndex]?.answer;

    try {
      await approveQuizAnswer(
        studentResult.studentquizid,
        user.userid,
        selectedStudentResult.userId,
        selectedQuiz.quizid,
        itemIndex,
        answerToSubmit
      );

      setEditedAnswers((prev) => ({
        ...prev,
        [itemIndex]: {
          ...prev[itemIndex],
          isapproved: true,
          isdisapproved: false,
        },
      }));

      setCurrentItemIndex(itemIndex);
      setShowFeedbackPerItemModal(true);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      toast.error(`Error approving item ${itemIndex}`);
    }
  };

  const handleCheck = async (itemIndex: number) => {
    if (
      !studentResult ||
      !selectedStudentResult?.userId ||
      !selectedQuiz?.quizid
    ) {
      return;
    }

    if (!user?.userid) {
      throw new Error("User ID is undefined");
    }

    const answerToSubmit = editedAnswers[itemIndex]?.editeditem
      ? editedAnswers[itemIndex].editeditem
      : studentAnswers[itemIndex]?.answer;

    try {
      await checkQuizAnswer(
        studentResult.studentquizid,
        user.userid,
        selectedStudentResult.userId,
        selectedQuiz.quizid,
        itemIndex,
        answerToSubmit || ""
      );

      setEditedAnswers((prev) => ({
        ...prev,
        [itemIndex]: {
          ...prev[itemIndex],
          isapproved: true,
          isdisapproved: false,
        },
      }));

      setCurrentItemIndex(itemIndex);
      setShowFeedbackPerItemModal(true);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      toast.error(`Error marking check for item ${itemIndex}`);
    }
  };

  const handleUncheck = async (itemIndex: number) => {
    if (
      !studentResult ||
      !selectedStudentResult?.userId ||
      !selectedQuiz?.quizid
    ) {
      toast.error("Missing required data for disapproval.");
      return;
    }

    if (!user?.userid) {
      throw new Error("User ID is undefined");
    }

    const answerToSubmit = editedAnswers[itemIndex]?.editeditem
      ? editedAnswers[itemIndex].editeditem
      : studentAnswers[itemIndex]?.answer;

    try {
      await disapproveQuizAnswer(
        studentResult.studentquizid,
        user.userid,
        selectedStudentResult.userId,
        selectedQuiz.quizid,
        itemIndex,
        answerToSubmit || ""
      );

      setEditedAnswers((prev) => ({
        ...prev,
        [itemIndex]: {
          ...prev[itemIndex],
          isapproved: false,
          isdisapproved: true,
        },
      }));

      setCurrentItemIndex(itemIndex);
      setShowFeedbackPerItemModal(true);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      toast.error(`Error marking uncheck for item ${itemIndex}`);
    }
  };
  const handleBonusScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(e.target.value);
    setBonusScore(score);
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
    isModalOpen;
    try {
      setIsSaving(true);
      if (
        editedStatus !== "PENDING" &&
        Object.keys(editedAnswers).some((key) => {
          const studentAnswer = studentAnswers[parseInt(key)];
          const editedAnswer = editedAnswers[parseInt(key)].editeditem;

          return studentAnswer.answer !== editedAnswer;
        })
      ) {
        setEditedStatus("NONE");
      }

      if (!user?.userid) {
        throw new Error("User ID is undefined");
      }

      if (feedback === null) {
        toast.error("Feedback cannot be null");
        return;
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
    }
  };

  useEffect(() => {
    if (studentResult?.recognizedAnswers) {
      const answersMap = studentResult.recognizedAnswers.reduce(
        (
          acc: { [key: number]: { answer: string; correct: boolean } },
          answerObj
        ) => {
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleHover = (itemIndex: number) => {
    setHoveredItem(itemIndex);
    console.log(hoveredItem);
    setShowFeedbackPerItemModalDisplay(true);
    setFeedbackPerItem(
      editedAnswers[itemIndex]?.feedback.join("\n") || "No feedback available."
    );
  };

  const handleMouseLeave = () => {
    setShowFeedbackPerItemModalDisplay(false);
    setHoveredItem(null);
  };

  const handleToggleCorrect = (index: number) => {
    const isCorrect = studentAnswers[index]?.correct;
    if (isCorrect) {
      handleUncheck(index);
    } else {
      handleCheck(index);
    }
  };

  const handleStudentAnswerChange = (index: number, value: string) => {
    const updatedAnswers = {
      ...editedAnswers,
      [index]: { ...editedAnswers[index], editeditem: value, isedited: false },
    };
    setEditedAnswers(updatedAnswers);
    setEditedStatus("PENDING");
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

      const editedAnswerObj = editedAnswers[i] || {
        editeditem: "",
        isedited: false,
        isapproved: false,
        isdisapproved: false,
        editedby: "",
      };

      // let editedAnswer =
      //   editedAnswerObj && editedAnswerObj.isedited
      //     ? editedAnswerObj.editeditem
      //     : "";

      let highlightClass = "";
      if (editedStatus === "NONE") {
        highlightClass = "";
      } else if (
        editedAnswerObj.isedited &&
        editedAnswerObj.editedby === "teacher" &&
        !studentAnswer.correct
      ) {
        highlightClass = "highlight-disapproved";
      } else if (
        editedAnswerObj?.isapproved &&
        editedAnswerObj.isedited &&
        editedAnswerObj.editedby === "teacher"
      ) {
        highlightClass = "highlight-approved";
      } else if (editedAnswerObj?.isdisapproved && !studentAnswer.correct) {
        highlightClass = "highlight-disapproved";
      } else if (editedAnswerObj?.isapproved && !studentAnswer.correct) {
        highlightClass = "highlight-disapproved";
      } else if (
        editedAnswerObj.isedited &&
        editedAnswerObj.editedby === "teacher"
      ) {
        highlightClass = "highlight-approved";
      } else if (
        editedAnswerObj.isedited &&
        editedAnswerObj.editedby === "student" &&
        !editedAnswerObj.isdisapproved &&
        !editedAnswerObj.isapproved
      ) {
        highlightClass = "highlight-edited";
      } else if (
        editedAnswerObj.isedited &&
        editedAnswerObj.editedby === "student"
      ) {
        highlightClass = "highlight-approved";
      }

      rows.push(
        <tr key={i}>
          <td>
            {i}{" "}
            {selectedQuiz?.totalitems !== undefined &&
              i <= selectedQuiz.totalitems && (
                <input
                  type="checkbox"
                  className="custom-checkbox"
                  checked={!!studentAnswers[i]?.correct}
                  onChange={() => handleToggleCorrect(i)}
                />
              )}
          </td>

          <td>
            {/* {editedStatus !== "NONE" &&
              !editedAnswerObj?.isapproved &&
              editedAnswerObj?.isdisapproved &&
              editedAnswerObj?.isedited &&
              editedAnswerObj?.editedby === "student" && (
                <div className="approval-buttons">
                  <button
                    onClick={() => handleCheck(i)}
                    className="btn btn-primary"
                  >
                    Mark Correct
                  </button>
                </div>
              )} */}
            {/* {editedStatus !== "NONE" &&
              editedAnswerObj?.isapproved &&
              !editedAnswerObj?.isdisapproved &&
              editedAnswerObj?.isedited &&
              editedAnswerObj?.editedby === "student" && (
                <div className="approval-buttons">
                  <button
                    onClick={() => handleUncheck(i)}
                    className="btn btn-danger"
                  >
                    Mark Incorrect
                  </button>
                </div>
              )} */}
            {editedStatus !== "NONE" &&
              !editedAnswerObj?.isapproved &&
              !editedAnswerObj?.isdisapproved &&
              editedAnswerObj?.isedited &&
              editedAnswerObj?.editedby === "student" && (
                <div className="approval-buttons">
                  <button
                    onClick={() => handleApprove(i)}
                    className="btn btn-primary"
                  >
                    Accept Edit
                  </button>
                </div>
              )}
          </td>
          <td>{studentAnswer.answer}</td>
          {selectedQuiz?.totalitems !== undefined &&
            i <= selectedQuiz.totalitems && (
              <td className={`td ${highlightClass}`}>
                {isEditing && editedAnswerObj.isedited === false ? (
                  <input
                    type="text"
                    value={editedAnswerObj?.editeditem}
                    className="input-box"
                    onChange={(e) =>
                      handleStudentAnswerChange(i, e.target.value)
                    }
                  />
                ) : (
                  editedAnswerObj?.editeditem
                )}
              </td>
            )}

          <td>{correctAnswer}</td>
          <td>
            {editedAnswers[i]?.feedback?.length > 0 && (
              <FontAwesomeIcon
                icon={faStickyNote}
                className="notification-icon"
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </td>
        </tr>
      );
    }

    return rows;
  };

  const handleSaveFeedbackPerItem = async (itemIndex: number) => {
    const feedbackForItem = feedbackperitem;

    if (!feedbackForItem) {
      toast.error("Feedback is empty for this item.");
      return;
    }
    if (!studentResult?.studentquizid) {
      toast.error("Studentquizid is empty for this item.");
      return;
    }

    try {
      const itemId = itemIndex;

      await addFeedbackToEditedAnswerPerItem(
        studentResult?.studentquizid,
        itemId,
        feedbackForItem
      );

      setFeedbackPerItem("");
      setShowFeedbackPerItemModal(false);
    } catch (error) {
      toast.error("Error saving feedback.");
    }
  };

  return (
    <div className="QuizResults Main MainContent">
      <Header />
      <BackBtn />
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
                <h3>Score: {studentResult?.score}</h3>
                <div className="additional-points">
                  <h3>
                    Bonus Points:{" "}
                    {isEditing ? (
                      <input
                        type="number"
                        value={bonusScore}
                        className="bonus-input"
                        onChange={handleBonusScoreChange}
                      />
                    ) : (
                      bonusScore
                    )}
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
                  alt="Student's quiz"
                />
                {isEditing ? (
                  <div className="feedback-container">
                    <textarea
                      value={feedback || ""}
                      className="feedback-input"
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                    />
                  </div>
                ) : feedback === "No feedback given" ? (
                  <p className="no-feedback">{feedback}</p>
                ) : (
                  <div className="feedback-container">
                    <p
                      className="feedback"
                      style={{ fontStyle: "italic", fontSize: "13px" }}
                    >
                      {feedback}
                    </p>
                  </div>
                )}
              </div>

              <div className="question-answer-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Review</th>
                      <th>Scanned Answer</th>
                      <th>Edited Answer</th>
                      <th>Correct Answer</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{renderRows()}</tbody>
                </table>
              </div>
              <div className="viewcenter-button">
                {isEditing ? (
                  <button
                    className="viewedit"
                    onClick={handleSaveClick}
                    disabled={isSaving}
                  >
                    Save
                  </button>
                ) : (
                  <button className="viewedit" onClick={() => handleEdit()}>
                    Edit
                  </button>
                )}
                <button className="viewclose" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
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

      {showFeedbackPerItemModal && currentItemIndex !== null && (
        <div className="modal-container-feedback">
          <div className="modal-content-feedback">
            <h4>Include Feedback</h4>
            <textarea
              id="feedbackInput"
              onChange={(e) => setFeedbackPerItem(e.target.value)}
              className="feedback-input"
              placeholder="Type your feedback here..."
            ></textarea>
            <div className="modal-buttons-feedback">
              <button onClick={() => setShowFeedbackPerItemModal(false)}>
                Close
              </button>
              <button
                onClick={() => {
                  handleSaveFeedbackPerItem(currentItemIndex);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showFeedbackPerItemModalDisplay && (
        <div className="feedback-modal show">
          <div className="modal-content">
            <label>
              <b>Feedback</b>
            </label>
            <p className="feedback-text">{feedbackperitem}</p>
          </div>
        </div>
      )}

      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default QuizResults;
