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
import { saveStudentQuiz } from "../../../../apiCalls/studentQuizApi";
import { SyncLoader } from "react-spinners";
import ConfirmationModal from "../../../Modal/ConfirmationModal";

interface AnswerMap {
  [key: number]: string;
}

const QuizResultEdit = () => {
  const [answers, setAnswers] = useState<{ itemnumber: number; answer: string }[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<AnswerMap>({});
  const [studentQuizId, setStudentQuizId] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [bonusScore, setBonusScore] = useState<number>(0);
  const [editedAnswers, setEditedAnswers] = useState<{ [key: number]: string }>(
    {}
  );
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();

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
          acc[curr.itemnumber] = curr.editeditem; 
          return acc;
        },
        {} as { [key: number]: string }
      );
      setEditedAnswers(extractedEditedAnswers);

      setEditedStatus(studentResult?.editedstatus || "");
    }
  }, [studentResult]);

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

  const handleStudentAnswerChange = (index: number, value: string) => {
    const updatedAnswers = { ...editedAnswers, [index]: value };
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

      if (
        editedStatus !== "PENDING" &&
        Object.keys(editedAnswers).some(
          (key) =>
            studentAnswers[parseInt(key)] !== editedAnswers[parseInt(key)]
        )
      ) {
        setEditedStatus("PENDING");
      }

      if (studentQuizId) {
        const formattedAnswers = Object.keys(editedAnswers)
          .map((key) => `${key}. ${editedAnswers[parseInt(key)]}`)
          .join("\n");
        await saveStudentQuiz(
          studentQuizId,
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

  const renderRows = () => {
    const totalItems = Math.max(
      answers.length,
      Object.keys(studentAnswers).length
    );
    const rows = [];

    for (let i = 1; i <= totalItems; i++) {
      const studentAnswer = studentAnswers[i] || "";
      const correctAnswer = answers[i - 1]?.answer || "";
      const editedAnswer = editedAnswers[i] || ""; 
      const status = studentResult?.editedstatus || "";

      rows.push(
        <li key={i} className="tr">
          <p className="td"></p>
          <p className="td">{i}</p>
          <p className="td">{studentAnswer}</p>
          <p className="td">
            <input
              type="text"
              value={editedAnswer}
              onChange={(e) => handleStudentAnswerChange(i, e.target.value)} 
              disabled ={status==="PENDING"}
            />
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
                <h3 className="score">Score: {selectedStudentResult?.score}</h3>
                <div className="additional-points">
                  <span>Bonus Points:</span>
                  <input
                    type="number"
                    value={bonusScore}
                    onChange={(e) => setBonusScore(Number(e.target.value))}
                  />
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
            />
          </>
        )}
      </main>

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default QuizResultEdit;
