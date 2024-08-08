import Header from "../../Common/Header";
import Gradients from "../../Common/Gradients";
import SmilingRobot from "../../Common/SmilingRobot";
import { useQuiz } from "../../Context/QuizContext";
import { useEffect, useState } from "react";
import { getQuizResults, getAnswerKey } from "../../../apiCalls/QuizAPIs";
import { StudentImageResult } from "../../Interface/Quiz";
import { useCurrUser } from "../../Context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentQuizResults = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<string[]>([]);
  const { user } = useCurrUser();

  const { selectedStudentResult, selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();

  useEffect(() => {
    if (user?.userid && selectedQuiz?.quizid) {
      getQuizResults(user?.userid, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          return getAnswerKey(selectedQuiz.quizid);
        })
        .then((answerKey) => {
          const extractedAnswers = extractAnswers(answerKey);
          setAnswers(extractedAnswers);
        })
        .catch((error) => {
          toast.error("Error fetching data", error)
        });
    }
  }, [user, selectedQuiz]);

  const extractAnswers = (input: string) => {
    return input
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, ""));
  };

  useEffect(() => {
    if (studentResult?.recognizedtext) {
      setStudentAnswers(extractAnswers(studentResult.recognizedtext));
    }
  }, [studentResult]);

  console.log("Selected Student Result:", selectedStudentResult);
  console.log("Current User:", user);

  return (
    <div className="QuizResults Main MainContent">
      <Header />
      <main>
        <div className="student-details">
          <div>
            <h3>
              {user?.firstname}{" "}
              {user?.lastname}
            </h3>
          </div>
          <h3>Score: {studentResult?.score}</h3>
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
                <p className="td">Item No.</p>
                <p className="td">Scanned Answer</p>
                <p className="td">Correct Answer</p>
                <p />
              </li>
            </ul>
            <ul className="tbody">
              {answers.map((item, i) => (
                <li key={i} className="tr">
                  <p className="td"></p>
                  <p className="td">{i + 1}</p>
                  <p className="td">{studentAnswers[i] || "No answer"}</p>
                  <p className="td">{item}</p>
                  <p className="td"></p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <SmilingRobot />
      <Gradients />
      <ToastContainer/>
    </div>
  );
};

export default StudentQuizResults;
