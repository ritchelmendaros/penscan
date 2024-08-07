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

const QuizResultEdit = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<string[]>([]);
  const [studentQuizId, setStudentQuizId] = useState<string>("");

  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedStudentResult?.userId && selectedQuiz?.quizid) {
      getQuizResults(selectedStudentResult.userId, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  }, [selectedStudentResult, selectedQuiz]);

  const extractAnswers = (input: string) => {
    return input
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, ""));
  };

  useEffect(() => {
    if (studentResult?.recognizedtext) {
      const extractedAnswers = extractAnswers(studentResult.recognizedtext);
      const studentquizid = studentResult.studentquizid;
      const slicedAnswers = extractedAnswers.slice(1); 

      setStudentAnswers(slicedAnswers); 
      setStudentQuizId(studentquizid);
    }

    if (selectedQuiz?.quizanswerkey) {
      const theAnswers = extractAnswers(selectedQuiz.quizanswerkey);
      setAnswers(theAnswers);
    }
  }, [selectedQuiz, studentResult]);

  const handleClose = () => {
    navigate("/dashboard/class/quiz");
  };

  const handleStudentAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...studentAnswers];
    updatedAnswers[index] = value;
    setStudentAnswers(updatedAnswers);
  };

  const handleSaveClick = async () => {
    try {
      for (let i = 0; i < studentAnswers.length; i++) {
        if (!studentAnswers[i]) {
          toast.error(`Answer for item ${i + 1} is required.`);
          return;
        }
      }
  
      if (studentQuizId) {
        const firstAnswer = studentResult?.recognizedtext.split("\n")[0];
        
        
        const formattedAnswers = [
          firstAnswer, 
          ...studentAnswers.map((answer, index) => `${index + 1}. ${answer}`) 
        ].join("\n");
  
        await saveStudentQuiz(studentQuizId, formattedAnswers);
        toast.success("Successfully saved changes!");
        navigate("/dashboard/class/quiz");
      } else {
        toast.error("Quiz ID is required.");
      }
    } catch (error) {
      toast.error("Error saving changes");
    }
  };
  

  return (
    <div className="QuizResults Main MainContent">
      <Header />
      <main>
        <div className="student-details">
          <div>
            <h3>
              {selectedStudentResult?.firstName}{" "}
              {selectedStudentResult?.lastName}
            </h3>
          </div>
          <h3>Score: {selectedStudentResult?.score}</h3>
        </div>

        <div className="main-results">
          <img
            src={`data:image/png;base64,${studentResult?.base64Image}`}
            alt=""
          />

          <div className="table">
            <ul className="thead">
              <li className="th">
                <p />
                <p className="td"></p>
                <p className="td">Scanned Answer</p>
                <p className="td">Correct Answer</p>
                <p />
              </li>
            </ul>
            <ul className="tbody">
              {answers.map((item, i) => (
                <li key={i} className="tr">
                  <p className="td"></p>
                  <p className="td"></p>
                  <p className="td">
                    <input
                      type="text"
                      value={`${i + 1}. ${studentAnswers[i]}`}
                      onChange={(e) =>
                        handleStudentAnswerChange(
                          i,
                          e.target.value.replace(/^\d+\.\s*/, "")
                        )
                      }
                    />
                  </p>
                  <p className="td">{item}</p>
                  <p className="td"></p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="center-button">
          <button className="save" onClick={handleSaveClick}>
            Save
          </button>
          <button className="cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </main>

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default QuizResultEdit;
