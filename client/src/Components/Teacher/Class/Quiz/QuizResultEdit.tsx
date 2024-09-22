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

interface AnswerMap {
  [key: number]: string;
}

const QuizResultEdit = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [studentAnswers, setStudentAnswers] = useState<AnswerMap>({});
  const [studentQuizId, setStudentQuizId] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [bonusScore, setBonusScore] = useState<number>(0);
  const [editedAnswers, setEditedAnswers] = useState<{ [key: number]: string }>({});
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  }, [selectedStudentResult, selectedQuiz]);

  // Updated to handle the new structure of editedanswer
  useEffect(() => {
    if (studentResult?.editedanswer && Array.isArray(studentResult.editedanswer)) { 
      const extractedEditedAnswers = studentResult.editedanswer.reduce((acc, curr, index) => {
        // Changed to store only the edited item string
        acc[index + 1] = curr.editeditem; // Store just the edited item string
        return acc;
      }, {} as { [key: number]: string }); // Ensure it's a string map
      setEditedAnswers(extractedEditedAnswers);
    
      setEditedStatus(studentResult?.editedstatus || "");
    }
  }, [studentResult]);

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
      const extractedAnswers = extractAnswers(studentResult.recognizedtext);
      setStudentAnswers(extractedAnswers);
      setStudentQuizId(studentResult.studentquizid);
    }

    if (selectedQuiz?.quizanswerkey) {
      const correctAnswers = extractAnswers(selectedQuiz.quizanswerkey);
      setAnswers(correctAnswers);
    }
  }, [selectedQuiz, studentResult]);

  const handleClose = () => {
    navigate("/dashboard/class/quiz");
  };

  const handleStudentAnswerChange = (index: number, value: string) => {
    const updatedAnswers = { ...editedAnswers, [index + 1]: value };
    setEditedAnswers(updatedAnswers);
    setEditedStatus("PENDING"); 
  };

  const handleSaveClick = async () => {
    try {
      setIsSaving(true);

      for (let i = 1; i <= Object.keys(answers).length; i++) {
        if (studentAnswers[i] !== "" && studentAnswers[i] !== undefined && !editedAnswers[i]) {
          toast.error(`Answer for item ${i} is required.`);
          return;
        }
      }

      if (
        editedStatus !== "Edited" &&
        Object.keys(editedAnswers).some(
          (key) =>
            studentAnswers[parseInt(key)] !== editedAnswers[parseInt(key)]
        )
      ) {
        setEditedStatus("Edited");
      }

      if (studentQuizId) {
        const formattedAnswers = Object.keys(editedAnswers)
          .map((key) => `${key}. ${editedAnswers[parseInt(key)]}`)
          .join("\n");
          console.log({
            studentQuizId,
            formattedAnswers,
            feedback,
            bonusScore,
            editedStatus,
          });
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
    const rows = [];

    for (let i = 1; i <= Object.keys(answers).length; i++) {
      const correctAnswer = answers[i] || "";
      const scannedAnswer =
        studentResult?.recognizedtext
          .split("\n")
          .find((line) => line.startsWith(`${i}.`))
          ?.substring(3) || "";
      const editedAnswer = editedAnswers[i];

      rows.push(
        <li key={i} className="tr">
          <p className="td"></p>
          <p className="td">{i}</p>
          <p className="td">{scannedAnswer}</p>
          <p className="td">
            <input
              type="text"
              value={editedAnswer}
              onChange={(e) => handleStudentAnswerChange(i - 1, e.target.value)}
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
