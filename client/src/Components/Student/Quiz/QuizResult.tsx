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
import { useNavigate } from "react-router-dom";
import {
  studentuploadStudentQuiz,
  getAllActivityLogs,
} from "../../../apiCalls/studentQuizApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

interface Answer {
  itemnumber: number;
  answer: string;
  correct: boolean;
}

const StudentQuizResults = () => {
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [formattedDueDate, setFormattedDueDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [studentQuizId, setStudentQuizId] = useState("");
  const currentDate = new Date();

  useEffect(() => {
    if (user?.userid && selectedQuiz?.quizid) {
      setLoading(true);
      getQuizResults(user?.userid, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.comment || "No feedback given");
          setStudentQuizId(result.studentquizid);
          return getAnswerKey(selectedQuiz.quizid);
        })
        .then((answerKey) => {
          const parsedAnswerKey =
            typeof answerKey === "string" ? JSON.parse(answerKey) : answerKey;
          setCorrectAnswers(parsedAnswerKey.quizanswerkey);
          const dueDate = parsedAnswerKey.dueDateTime;
          setDueDate(dueDate);
          const formattedDueDate = formatDueDate(dueDate);
          setFormattedDueDate(formattedDueDate);
        })
        .catch(() => {})
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
          correct: recognizedAnswer.correct,
        })
      );
      setStudentAnswers(extractedAnswers);
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

  const renderRows = () => {
    const maxItemNumber = Math.max(
      ...correctAnswers.map((ans) => ans.itemnumber),
      ...studentAnswers.map((ans) => ans.itemnumber)
    );

    const studentAnswerMap = studentAnswers.reduce((acc, studentAnswer) => {
      acc[studentAnswer.itemnumber] = studentAnswer.answer;
      return acc;
    }, {} as Record<number, string>);

    const rows = [];
    const currentDate = new Date();
    const dueDateTime = dueDate ? new Date(dueDate) : null;

    for (let i = 1; i <= maxItemNumber; i++) {
      const studentAnswer = studentAnswerMap[i] || "";
      const editedAnswerObj = editedAnswers[i] || {
        editeditem: "",
        isapproved: false,
        isdisapproved: false,
      };
      const correctAnswer =
        dueDateTime && dueDateTime < currentDate
          ? correctAnswers.find((ans) => ans.itemnumber === i)?.answer || ""
          : "";

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

      rows.push(
        <li key={i} className="tr1">
          <p className="td1"></p>
          <p className="td1">{studentAnswers[i - 1]?.correct ? "✔️" : "❌"}</p>
          <p className="td1">{i}</p>
          <p className="td1" style={{ marginLeft: "-50px" }}>
            {studentAnswer}
          </p>
          <p
            className={`td1 ${highlightClass}`}
            style={{ marginLeft: "-40px" }}
          >
            {editedItem}
          </p>
          <p className="td1">{correctAnswer}</p>
          <p className="td1"></p>
        </li>
      );
    }

    return rows;
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

  const handleEdit = () => {
    const editedStatus = studentResult?.editedstatus;
    const currentDate = new Date();

    if (!dueDate) {
      toast.error("Due date is not available.");
      return;
    }

    const dueDateTime = new Date(dueDate);

    if (dueDateTime < currentDate) {
      toast.error("Can't edit: This quiz is overdue.");
      return;
    } else if (editedStatus === "APPROVED") {
      toast("Can't edit: Edited answers are already evaluated.");
    } else if (editedStatus === "PENDING") {
      toast("Can't edit: You can't edit more then once.");
    } else {
      navigate(`/dashboard/class/quiz/quiz-result-edit`);
    }
  };

  const handleClose = () => {
    navigate(`/dashboard/class/${clickedClass?.classid}`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && selectedQuiz) {
      setIsLoading(true);
      try {
        await studentuploadStudentQuiz(
          selectedQuiz.quizid,
          user?.userid || "",
          selectedFile
        );

        toast.success("File uploaded successfully!");
        setSelectedFile(null);
        setIsModalOpen(false);
        navigate(`/dashboard/class/${clickedClass?.classid}`);
      } catch (error) {
        toast.error("File upload failed.");
        setSelectedFile(null);
        setIsModalOpen(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warn(
        "Please select a file to upload and ensure a quiz is selected."
      );
    }
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
              {formattedDueDate && (
                <div className="due-date">
                  <h5>
                    Due Date: <em>{formattedDueDate}</em>
                  </h5>
                </div>
              )}

              <div className="score-container">
                <h3 className="score">Score: {studentResult?.score}</h3>
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
                  alt=""
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={isHovered ? "hovered" : ""}
                />
                {feedback === "No feedback given" ? (
                  <p className="no-feedback">{feedback}</p>
                ) : (
                  <div className="feedback-container">
                    <p className="no-feedback">{feedback}</p>
                  </div>
                )}
              </div>

              <div className="table1">
                <ul className="thead1">
                  <li className="th1">
                    <p />
                    <p className="td1"></p>
                    <p className="td1">Item</p>
                    <p className="td1" style={{ marginLeft: "-50px" }}>
                      Scanned Answer
                    </p>
                    <p className="td1" style={{ marginLeft: "-30px" }}>
                      Edited Answer
                    </p>
                    {dueDate && new Date(dueDate) < currentDate && (
                      <p className="td1">Correct Answer</p>
                    )}

                    <p />
                  </li>
                </ul>

                <ul className="tbody1">{renderRows()}</ul>
                <div className="buttons-container">
                  {!studentResult && (
                    <button
                      className="studentviewupload"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Upload
                    </button>
                  )}
                  {studentResult && (
                    <button className="studentviewedit" onClick={handleEdit}>
                      Edit
                    </button>
                  )}
                  <button onClick={handleClose} className="studentviewclose">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {isModalOpen && (
        <div className="modalquiz-overlay">
          <div className="modalquiz-content">
            <h3>Please Upload a File</h3>
            <input
              className="modalquiz-input"
              style={{ marginTop: "10px" }}
              type="file"
              onChange={handleFileChange}
            />
            {isLoading ? (
              <div className="loader">
                <SyncLoader size={10} color={"#416edf"} loading={isLoading} />
              </div>
            ) : (
              <div className="modalquiz-buttons">
                <button className="modalsubmit" onClick={handleUpload}>
                  Submit
                </button>
                <button
                  className="modalclose"
                  style={{
                    width: "70px",
                    borderRadius: "7px",
                    marginLeft: "10px",
                    fontWeight: "bold",
                    backgroundColor: "#e94f4f",
                  }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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

export default StudentQuizResults;
