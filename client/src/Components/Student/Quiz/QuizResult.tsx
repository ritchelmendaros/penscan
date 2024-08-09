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

interface Answer {
  number: string;
  answer: string;
}

const StudentQuizResults = () => {
  const [answers, setAnswers] = useState<string[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<Answer[]>([]);
  const { user } = useCurrUser();
  const { selectedQuiz } = useQuiz();
  const [studentResult, setStudentResult] = useState<StudentImageResult>();

  useEffect(() => {
    if (user?.userid && selectedQuiz?.quizid) {
      getQuizResults(user?.userid, selectedQuiz.quizid)
        .then((result) => {
          setStudentResult(result);
          return getAnswerKey(selectedQuiz.quizid);
        })
        .then((answerKey) => {
          const extractedAnswers = extractAnswersFromAnswerKey(answerKey);
          setAnswers(extractedAnswers);
        })
        .catch((error) => {
          toast.error("Error fetching data", error);
        });
    }
  }, [user, selectedQuiz]);

  const extractAnswersFromAnswerKey = (input: string) => {
    return input
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, ""));
  };

  const extractAnswersFromRecognizedText = (input: string): Answer[] => {
    const lines = input.trim().split("\n");
    return lines.map((line) => {
      const match = line.match(/^(\d+)\.\s*(.*)$/); 
      if (match) {
        return {
          number: match[1],
          answer: match[2],
        };
      }
      return null;
    }).filter((item): item is Answer => item !== null);
  };

  useEffect(() => {
    if (studentResult?.recognizedtext) {
      setStudentAnswers(extractAnswersFromRecognizedText(studentResult.recognizedtext));
    }
  }, [studentResult]);

  const renderRows = () => {
    const rows = [];
    let correctIndex = 0;

    for (let i = 1; i <= answers.length; i++) {
      const foundAnswer = studentAnswers.find((ans) => parseInt(ans.number) === i);

      if (foundAnswer) {
        rows.push(
          <li key={i} className="tr">
            <p className="td"></p>
            <p className="td">{foundAnswer.number}</p>
            <p className="td">{foundAnswer.answer}</p>
            <p className="td">{answers[correctIndex]}</p>
            <p className="td"></p>
          </li>
        );
      } else {
        rows.push(
          <li key={i} className="tr">
            <p className="td"></p>
            <p className="td">{i}</p>
            <p className="td"></p>
            <p className="td">{answers[correctIndex]}</p>
            <p className="td"></p>
          </li>
        );
      }

      correctIndex++;
    }

    return rows;
  };

  return (
    <div className="QuizResults Main MainContent">
      <Header />
      <main>
        <div className="student-details">
          <div>
            <h3>{user?.firstname} {user?.lastname}</h3>
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
              {renderRows()}
            </ul>
          </div>
        </div>
      </main>

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default StudentQuizResults;
