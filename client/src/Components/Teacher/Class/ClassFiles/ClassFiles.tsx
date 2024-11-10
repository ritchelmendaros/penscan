import { useEffect, useState } from "react";
import Thumbnail from "../../../Common/Thumbnail";
import { useClass } from "../../../Context/ClassContext";
import { useCurrUser } from "../../../Context/UserContext";
import { Quiz } from "../../../Interface/Quiz";
import { getAllQuizes } from "../../../../apiCalls/QuizAPIs";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../../Context/QuizContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setLocalStorage } from "../../../../Utils/LocalStorage";
import { SyncLoader } from "react-spinners";
import noDataGif from "../../../../assets/nodata.gif";
import { editQuiz, deleteQuiz } from "../../../../apiCalls/QuizAPIs";
import ConfirmationModal from "../../../Modal/ConfirmationModal";

const ClassFiles = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOptions, setActiveOptions] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [quizIdToDelete, setQuizIdToDelete] = useState<string | null>(null);
  const [editQuizNameState, setEditQuizName] = useState("");
  const [editDueDateState, setEditDueDate] = useState("");
  const [editAnswerKeyState, setEditAnswerKeyState] = useState<
    { itemnumber: number; answer: string }[]
  >([]);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const { clickedClass } = useClass();
  const { user } = useCurrUser();
  const { setSelectedQuiz } = useQuiz();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.userid && clickedClass?.classid) {
      getAllQuizes(user.userid, clickedClass.classid)
        .then((quiz) => {
          setQuizzes(quiz);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [clickedClass, user]);

  const handleClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);

    setLocalStorage("cid", quiz.classid);
    setLocalStorage("qid", quiz.quizid);
    setLocalStorage("qname", quiz.quizname);
    setLocalStorage("qtid", quiz.teacherid);

    navigate("/dashboard/class/quiz");
  };

  const handleOptionsToggle = (index: number) => {
    setActiveOptions(activeOptions === index ? null : index);
  };

  const handleEdit = (
    quizId: string,
    quizname: string,
    dueDate: string,
    answerKey: { itemnumber: number; answer: string }[]
  ) => {
    setEditingQuizId(quizId);
    setEditQuizName(quizname);
    setEditDueDate(dueDate);
    setEditAnswerKeyState(answerKey);
    setIsModalOpen(true);
    setActiveOptions(null);
  };

  const handleDelete = (quizId: string) => {
    setQuizIdToDelete(quizId);
    setActiveOptions(null);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (quizIdToDelete) {
        await deleteQuiz(quizIdToDelete);
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.quizid !== quizIdToDelete)
        );
      } else {
        console.error("No quiz ID to delete.");
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    } finally {
      setIsDeleting(false);
      setQuizIdToDelete(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveEdit = async () => {
    if (editingQuizId && editQuizNameState && editDueDateState) {
      setIsSaving(true); 
      try {
        await editQuiz(
          editingQuizId,
          editQuizNameState,
          editDueDateState,
          editAnswerKeyState
        );
        toast.success("Quiz updated successfully!");
        setIsModalOpen(false);
        if (user?.userid && clickedClass?.classid) {
          setLoading(true);
          getAllQuizes(user.userid, clickedClass.classid)
            .then((quiz) => {
              setQuizzes(quiz);
              setLoading(false);
            })
            .catch(() => {
              setLoading(false);
            });
        }
      } catch (error) {
        toast.error("Failed to update quiz.");
      } finally {
        setIsSaving(false); 
        setActiveOptions(null);
      }
    }
  };

  return (
    <div className="ClassFiles">
      {loading ? (
        <div className="loader-container">
          <SyncLoader color="#3498db" loading={loading} size={15} />
        </div>
      ) : (
        <ul>
          {quizzes.length > 0 ? (
            quizzes.map((quiz, i) => (
              <li onClick={() => handleClick(quiz)} key={i}>
                <Thumbnail name={quiz.quizname} />
                <div className="options-container">
                  <button
                    className="three-dots"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOptionsToggle(i);
                    }}
                  >
                    &#x22EE;
                  </button>
                  {activeOptions === i && (
                    <div className="options-menu">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEdit(
                            quiz.quizid,
                            quiz.quizname,
                            quiz.dueDateTime,
                            quiz.quizanswerkey
                          );
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(quiz.quizid);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="empty-state">
              <img src={noDataGif} alt="No quizzes available" />
            </li>
          )}
        </ul>
      )}
      {isModalOpen && (
        <div className="quizmodal-overlay">
          <div className="quizmodal-content">
            <h2>Edit Quiz</h2>
            <div>
              <label>
                Quiz Name:q
                <input
                  type="text"
                  value={editQuizNameState}
                  onChange={(e) => setEditQuizName(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Due Date:
                <input
                  type="datetime-local"
                  value={editDueDateState}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>Answer Key:</label>
              <div className="answer-key-container">
                {editAnswerKeyState.map((item, index) => (
                  <div key={index} className="answer-item">
                    <label>
                      <span>Item {item.itemnumber}</span>{" "}
                      <input
                        type="text"
                        value={item.answer}
                        onChange={(e) => {
                          const updatedAnswers = [...editAnswerKeyState];
                          updatedAnswers[index].answer = e.target.value;
                          setEditAnswerKeyState(updatedAnswers);
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="button-container">
              <button className="modal-buttonsubmit" onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? (
                  <SyncLoader color="#fff" loading={isSaving} size={7} />
                ) : (
                  "Save"
                )}
              </button>
              <button className="modal-button" onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!quizIdToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setQuizIdToDelete(null)}
        message="Are you sure you want to delete this quiz?"
        loading={isDeleting}
      />

      <ToastContainer />
    </div>
  );
};

export default ClassFiles;
