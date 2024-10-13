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
import { studentsaveStudentQuiz } from "../../../apiCalls/studentQuizApi";
import { SyncLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { studentuploadStudentQuiz } from "../../../apiCalls/studentQuizApi";

interface Answer {
  itemnumber: number;
  answer: string;
  correct: boolean;
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
  const [isSaving, setIsSaving] = useState(false);
  const [studentQuizId, setStudentQuizId] = useState<string>("");
  const [isEditingAnswer] = useState(false);
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [formattedDueDate, setFormattedDueDate] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userid && selectedQuiz?.quizid) {
      setLoading(true);
      getQuizResults(user?.userid, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          setFeedback(result.comment || "No feedback given");
          setStudentQuizId(result.studentquizid || "");
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

  const renderRows = () => {
    const maxItemNumber = Math.max(
      ...correctAnswers.map((ans) => ans.itemnumber),
      ...studentAnswers.map((ans) => ans.itemnumber)
    );

    // const correctAnswerMap = correctAnswers.reduce((acc, correctAnswer) => {
    //   acc[correctAnswer.itemnumber] = correctAnswer.answer;
    //   return acc;
    // }, {} as Record<number, string>);
    const studentAnswerMap = studentAnswers.reduce((acc, studentAnswer) => {
      acc[studentAnswer.itemnumber] = studentAnswer.answer;
      return acc;
    }, {} as Record<number, string>);

    const rows = [];
    for (let i = 1; i <= maxItemNumber; i++) {
      // const correctAnswer = correctAnswerMap[i] || "";
      const studentAnswer = studentAnswerMap[i] || "";
      const editedAnswerObj = editedAnswers[i] || {
        editeditem: "",
        isapproved: false,
        isdisapproved: false,
        isedited: false,
      };

      const editedStatus = studentResult?.editedstatus;

      // let editedItem = editedAnswerObj.isedited
      //   ? editedAnswerObj.editeditem
      //   : "";

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

      rows.push(
        <li key={i} className="tr">
          <p className="td"></p>
          <p className="td">{studentAnswers[i - 1]?.correct ? "✔️" : "❌"}</p>
          <p className="td">{i}</p>
          <p className="td" style={{ marginLeft: "-50px" }}>
            {studentAnswer}
          </p>
          <p className="td" style={{ marginLeft: "-40px" }}>
            <input
              type="text"
              className={`${highlightClass}`}
              value={editedAnswerObj.editeditem}
              onChange={(e) => handleStudentAnswerChange(i, e.target.value)}
              disabled={isDisabled}
            />
          </p>
          {/* <p className="td">{correctAnswer}</p> */}
          <p className="td"></p>
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

  const handleStudentAnswerChange = (index: number, value: string) => {
    const updatedAnswers = { ...editedAnswers, [index]: value };
    setEditedAnswers(updatedAnswers);
    setEditedStatus("PENDING");
  };

  const handleSave = () => {
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
      console.log(isSaving);
      if (
        editedStatus !== "PENDING" &&
        Object.keys(editedAnswers).some(
          (key) =>
            studentAnswers[parseInt(key)] !== editedAnswers[parseInt(key)]
        )
      ) {
        setEditedStatus("PENDING");
      }

      if (!user?.userid) {
        throw new Error('User ID is undefined'); 
      }

      if (studentQuizId) {
        const formattedAnswers = Object.keys(editedAnswers)
          .map((key) => `${key}. ${editedAnswers[parseInt(key)]}`)
          .join("\n");
        await studentsaveStudentQuiz(
          studentQuizId,
          user.userid,
          formattedAnswers,
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
                  <h3>Bonus Points: {studentResult?.bonusscore}</h3>
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

              <div className="table">
                <ul className="thead">
                  <li className="th">
                    <p />
                    <p className="td"></p>
                    <p className="td">Item</p>
                    <p className="td" style={{ marginLeft: "-50px" }}>
                      Scanned Answer
                    </p>
                    <p className="td" style={{ marginLeft: "-30px" }}>
                      Edited Answer
                    </p>
                    {/* <p className="td">Correct Answer</p> */}
                    <p />
                  </li>
                </ul>
                <ul className="tbody">{renderRows()}</ul>
                <div className="buttons-container">
                  {!studentResult && (
                    <button
                      className="studentviewupload"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Upload
                    </button>
                  )}
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

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default StudentQuizResultEdit;
