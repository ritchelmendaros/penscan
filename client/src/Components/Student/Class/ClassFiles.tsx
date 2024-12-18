import { useEffect, useState } from "react";
import { useClass } from "../../../Components/Context/ClassContext";
import { useCurrUser } from "../../../Components/Context/UserContext";
import { Quizzes, Quiz } from "../../Interface/Quiz";
import {
  getQuizResults,
  getQuizzesByClassId,
} from "../../../apiCalls/QuizAPIs";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../../Components/Context/QuizContext";
import { SyncLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { StudentImageResult } from "../../Interface/Quiz";
import "react-toastify/dist/ReactToastify.css";

const ClassFiles = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quizzes[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<StudentImageResult[]>([]);
  const { clickedClass } = useClass();
  const { user } = useCurrUser();
  const { setSelectedQuiz } = useQuiz();
  //for responsive
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (clickedClass?.classid) {
        try {
          const quiz: Quiz[] = await getQuizzesByClassId(clickedClass.classid);

          const quizzesWithProperMapping: Quizzes[] = quiz.map((q) => ({
            quizId: q.quizid,
            quizName: q.quizname,
            dueDateTime: formatDueDate(q.dueDateTime),
            dueDateTimeRaw: q.dueDateTime,
          }));
          setQuizzes(quizzesWithProperMapping);

          if (user?.userid) {
            const results = await Promise.all(
              quizzesWithProperMapping.map(async (q) => {
                try {
                  const result = await getQuizResults(user.userid, q.quizId);
                  return result;
                } catch (err) {
                  return null;
                }
              })
            );

            const filteredResults = results.filter(
              (result): result is StudentImageResult => result !== null
            );
            setQuizResults(filteredResults);
            console.log("Fetched quiz results:", filteredResults);
          }
        } catch (err) {
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizData();
  }, [clickedClass, user]);

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

  const mapQuizzesToQuiz = (quiz: Quizzes): Quiz => {
    return {
      quizid: quiz.quizId,
      classid: clickedClass?.classid || "",
      quizname: quiz.quizName,
      teacherid: user?.userid || "",
      quizanswerkey: [],
      dueDateTime: quiz.dueDateTime,
    };
  };

  const handleClick = (quiz: Quizzes) => {
    const selectedQuiz = mapQuizzesToQuiz(quiz);
    setSelectedQuiz(selectedQuiz);
    navigate("/dashboard/class/quiz/quiz-result");
  };

  const handleViewQuiz = (
    event: React.MouseEvent<HTMLButtonElement>,
    quiz: Quizzes
  ) => {
    event.stopPropagation();
    const selectedQuiz = mapQuizzesToQuiz(quiz);
    setSelectedQuiz(selectedQuiz);
    navigate("/dashboard/class/quiz/quiz-result");
  };

  const handleEditQuiz = (
    event: React.MouseEvent<HTMLButtonElement>,
    quiz: Quizzes
  ) => {
    event.stopPropagation();
    const currentDateTime = new Date();
    const dueDateTime = new Date(quiz.dueDateTimeRaw);
    if (dueDateTime < currentDateTime) {
      toast.error("Can't edit: Due date has passed.");
    } else {
      const selectedQuiz = mapQuizzesToQuiz(quiz);
      setSelectedQuiz(selectedQuiz);
      navigate("/dashboard/class/quiz/quiz-result-edit");
    }
  };

  const isQuizOverdue = (dueDateTime: string): boolean => {
    const dueDate = new Date(dueDateTime);
    const currentDate = new Date();
    return currentDate > dueDate;
  };

  const displayedQuizzes = new Set();

  return (
    <div className="Classes">
      {loading ? (
        <div className="loader">
          <SyncLoader color="#416edf" />
        </div>
      ) : (
<<<<<<< HEAD
        <div className="table">
          <div className="thead">
            <div className="tr">
              <p className="td">Quiz Name</p>
              <p className="td">Score</p>
              <p className="td"></p>
              <p className="td">Due Date</p>
              <p className="td" style={{ marginLeft: "30px" }}>
                Action
              </p>
            </div>
          </div>
          <div className="tbody">
            {quizzes.length > 0 ? (
              quizzes.map((quiz, i) => {
                if (displayedQuizzes.has(quiz.quizId)) {
                  return null;
                }

                displayedQuizzes.add(quiz.quizId);

                const result = quizResults.find(
                  (r) => r.quizid === quiz.quizId
                );
                const status = result
                  ? result.editedstatus
                  : "Not Yet Uploaded";
                const score = result ? result.finalscore : "N/A";
                const isOverdue = isQuizOverdue(quiz.dueDateTime);
                return (
                  <div className="tr" onClick={() => handleClick(quiz)} key={i}>
                    <p className="td">{quiz.quizName}</p>
                    <p className="td">{score}</p>
                    <p className="td">{status === "NONE" ? "" : status}</p>
                    <p className="td">{quiz.dueDateTime}</p>
                    <p className="td">
                      <div>
                        <button
                          className="view"
                          onClick={(event) => handleViewQuiz(event, quiz)}
                        >
                          View
                        </button>
                        <button
                          className="edit"
                          onClick={(event) => {
                            if (isOverdue) {
                              event.stopPropagation();
                              toast("This quiz is overdue. You can't edit it.");
                            } else if (status === "NONE" && !isOverdue) {
                              handleEditQuiz(event, quiz);
                            } else if (status === "PENDING") {
                              event.stopPropagation();
                              toast("This quiz is already edited.");
                            } else {
                              event.stopPropagation();
                              toast("Upload your quiz first.");
                            }
                          }}
                          disabled={isOverdue}
                        >
                          Edit
                        </button>
                      </div>
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="no-data-row">
                <div className="no-data-content">
                  <p className="empty-state">
                    There are no quizzes in this class yet.
=======
        <div>
          {isSmallScreen && quizzes.length === 0 ? (
            <div className="no-data-row">
              <div className="no-data-content">
                <p className="empty-state">No quizzes in this class yet.</p>
              </div>
            </div>
          ) : (
            <div className="table">
              <div className="thead">
                <div className="tr">
                  <p className="td">Quiz Name</p>
                  <p className="td">Score</p>
                  <p className="td-status">Status</p>
                  <p className="td-duedate">Due Date</p>
                  <p className="td" style={{ marginLeft: "30px" }}>
                    Action
>>>>>>> due-date
                  </p>
                </div>
              </div>
              <div className="tbody">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz, i) => {
                    if (displayedQuizzes.has(quiz.quizId)) {
                      return null;
                    }

                    displayedQuizzes.add(quiz.quizId);

                    const result = quizResults.find(
                      (r) => r.quizid === quiz.quizId
                    );
                    let status = result
                      ? result.editedstatus
                      : "Not Yet Uploaded";

                    // Adjust status display for small screens
                    if (isSmallScreen) {
                      status =
                        status === "NONE"
                          ? "No Upload"
                          : status === "APPROVED"
                          ? "Apprd"
                          : status === "PENDING"
                          ? "Pendg"
                          : status;
                    } else {
                    }

                    const score = result ? result.finalscore : "N/A";
                    const isOverdue = isQuizOverdue(quiz.dueDateTime);
                    return (
                      <div
                        className="tr"
                        onClick={() => handleClick(quiz)}
                        key={i}
                      >
                        <p className="td">{quiz.quizName}</p>
                        <p className="td">{score}</p>
                        <p className="td">{status}</p>
                        <p className="td">{quiz.dueDateTime}</p>
                        <p
                          className={`td ${
                            isSmallScreen
                              ? "small-screen-menu"
                              : "large-screen-buttons"
                          }`}
                        >
                          {isSmallScreen ? (
                            <>
                              <button
                                className="meatballs-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdown((prev) =>
                                    prev === quiz.quizId ? null : quiz.quizId
                                  );
                                }}
                              >
                                &#8942; {/* Vertical meatballs icon */}
                              </button>
                              {openDropdown === quiz.quizId && (
                                <div className="dropdown-menu">
                                  <button
                                    onClick={(event) => {
                                      const dueDate = quiz.dueDateTimeRaw;
                                      const isOverdue =
                                        dueDate &&
                                        new Date(dueDate) < new Date();

                                      if (!result && isOverdue) {
                                        event.stopPropagation();
                                        toast(
                                          "No data and can't upload. This quiz is overdue."
                                        );
                                      } else {
                                        handleViewQuiz(event, quiz);
                                      }
                                    }}
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={(event) => {
                                      const dueDate = quiz.dueDateTimeRaw;
                                      const isOverdue =
                                        dueDate &&
                                        new Date(dueDate) < new Date();
                                      if (isOverdue) {
                                        event.stopPropagation();
                                        toast(
                                          "Can't edit: This quiz is overdue."
                                        );
                                      } else if (
                                        status === "NONE" &&
                                        !isOverdue
                                      ) {
                                        handleEditQuiz(event, quiz);
                                      } else if (status === "PENDING") {
                                        event.stopPropagation();
                                        toast(
                                          "Can't edit: You can't edit more then once."
                                        );
                                      } else if (status === "APPROVED") {
                                        event.stopPropagation();
                                        toast(
                                          "Can't edit: Edited answers are already evaluated."
                                        );
                                      } else {
                                        event.stopPropagation();
                                        toast(
                                          "Can't edit: Upload your quiz first."
                                        );
                                      }
                                    }}
                                    disabled={isOverdue}
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                className="view"
                                onClick={(event) => {
                                  const dueDate = quiz.dueDateTimeRaw;
                                  const isOverdue =
                                    dueDate && new Date(dueDate) < new Date();

                                  if (!result && isOverdue) {
                                    event.stopPropagation();
                                    toast(
                                      "No data and can't upload. This quiz is overdue."
                                    );
                                  } else {
                                    handleViewQuiz(event, quiz);
                                  }
                                }}
                              >
                                View
                              </button>
                              <button
                                className="edit"
                                onClick={(event) => {
                                  const dueDate = quiz.dueDateTimeRaw;
                                  const isOverdue =
                                    dueDate && new Date(dueDate) < new Date();
                                  if (isOverdue) {
                                    event.stopPropagation();
                                    toast("Can't edit: This quiz is overdue.");
                                  } else if (status === "NONE" && !isOverdue) {
                                    handleEditQuiz(event, quiz);
                                  } else if (status === "PENDING") {
                                    event.stopPropagation();
                                    toast(
                                      "Can't edit: You can't edit more than once."
                                    );
                                  } else if (status === "APPROVED") {
                                    event.stopPropagation();
                                    toast(
                                      "Can't edit: Edited answers are already evaluated."
                                    );
                                  } else {
                                    event.stopPropagation();
                                    toast(
                                      "Can't edit: Upload your quiz first."
                                    );
                                  }
                                }}
                                disabled={isOverdue}
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-data-row">
                    <div className="no-data-content">
                      <p className="empty-state">
                        There are no quizzes in this class yet.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ClassFiles;
