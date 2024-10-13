import Header from "../../../Common/Header";
import Gradients from "../../../Common/Gradients";
// import SmilingRobot from "../../../Common/SmilingRobot";
import { useQuiz } from "../../../Context/QuizContext";
import { useEffect, useState } from "react";
import { getQuizResults } from "../../../../apiCalls/QuizAPIs";
import {
  approveQuizAnswer,
  disapproveQuizAnswer,
  getAllActivityLogs
} from "../../../../apiCalls/studentQuizApi";
import { StudentImageResult } from "../../../Interface/Quiz";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useCurrUser } from "../../../Context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

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
  const [dueDate, setDueDate] = useState<string | null>(null);
  // const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [refresh, setRefresh] = useState(0);
  const { user } = useCurrUser();
  const [studentQuizId, setStudentQuizId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (selectedStudentResult?.userId && selectedQuiz?.quizid) {
      getQuizResults(selectedStudentResult.userId, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.comment || "No feedback given");
          setStudentQuizId(result.studentquizid);
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

  const handleFetchLogs = async () => {
    if (showModal) {
      // If modal is already shown, close it
      setShowModal(false);
      return;
    }

    // If modal is not shown, fetch logs
    try {
      const response = await getAllActivityLogs(studentQuizId);
      if (response && Array.isArray(response.logs)) {
        setLogs(response.logs); // Make sure you're setting logs from the correct property
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

    try {
      await approveQuizAnswer(
        studentResult.studentquizid,
        user.userid,
        selectedStudentResult.userId,
        selectedQuiz.quizid,
        itemIndex,
        editedAnswers[itemIndex]?.editeditem || studentAnswers[itemIndex]
      );

      setEditedAnswers((prev) => ({
        ...prev,
        [itemIndex]: {
          ...prev[itemIndex],
          isapproved: true,
          isdisapproved: false,
        },
      }));

      toast.success(`Answer for item ${itemIndex} approved`);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      toast.error(`Error approving item ${itemIndex}`);
    }
  };

  const handleDisapprove = async (itemIndex: number) => {
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

    try {
      await disapproveQuizAnswer(
        studentResult.studentquizid,
        user.userid,
        selectedStudentResult.userId,
        selectedQuiz.quizid,
        itemIndex,
        editedAnswers[itemIndex]?.editeditem || studentAnswers[itemIndex]
      );

      setEditedAnswers((prev) => ({
        ...prev,
        [itemIndex]: {
          ...prev[itemIndex],
          isapproved: false,
          isdisapproved: true,
        },
      }));

      toast.success(`Answer for item ${itemIndex} disapproved`);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      toast.error(`Error disapproving item ${itemIndex}`);
    }
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

  // const handleCheckboxChange = (itemIndex: number) => {
  //   setSelectedItems((prevSelected) =>
  //     prevSelected.includes(itemIndex)
  //       ? prevSelected.filter((index) => index !== itemIndex)
  //       : [...prevSelected, itemIndex]
  //   );
  // };

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
        <tr key={i}>
          <td>{i}</td>
          <td>
            {editedStatus !== "NONE" &&
              !editedAnswerObj?.isapproved &&
              !editedAnswerObj?.isdisapproved &&
              isEditedDifferent && (
                <div className="approval-buttons">
                  <button
                    onClick={() => handleApprove(i)}
                    className="btn btn-primary"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDisapprove(i)}
                    className="btn btn-danger"
                  >
                    Disapprove
                  </button>
                </div>
              )}
          </td>
          <td>{studentAnswer}</td>
          <td className={`td ${highlightClass}`}>{editedAnswer || ""}</td>
          <td>{correctAnswer}</td>
        </tr>
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
                <h3>Score: {selectedStudentResult?.score}</h3>
                <div className="additional-points">
                  <h3>
                    Bonus Points: {studentResult?.bonusscore}
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
                      <th>Item</th>
                      <th>Approval</th>
                      <th>Scanned Answer</th>
                      <th>Edited Answer</th>
                      <th>Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>{renderRows()}</tbody>
                </table>
              </div>
              <div className="viewcenter-button">
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
              <h4 style={{marginBottom: "10px"}}><i>Logs</i></h4>
                {logs.length > 0 ? (
                    logs.map((log, index) => (
                        <li key={index} style={{marginBottom: "15px", fontSize: "12px"}}><i>{log}</i></li>
                    ))
                ) : (
                    <li>No logs available</li>
                )}
            </ul>
        </div>
    </div>
)}


      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default QuizResults;
