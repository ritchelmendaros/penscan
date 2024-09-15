import { useEffect, useState } from "react";
import { useQuiz } from "../../../Context/QuizContext";
import { getQuizAnalysis } from "../../../../apiCalls/QuizAPIs";
import { ItemAnalysisInterface } from "../../../Interface/Quiz";
import { SyncLoader } from "react-spinners";

const Analysis = () => {
  const { selectedQuiz, studentScoreResults } = useQuiz();
  const [itemAnalysis, setItemAnalysis] = useState<ItemAnalysisInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedQuiz?.quizid) {
      getQuizAnalysis(selectedQuiz.quizid)
        .then((res) => {
          setItemAnalysis(res);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedQuiz]);
  return (
    <div className="Analysis">
      {loading ? (
        <div className="loader-container">
          <SyncLoader color="#3498db" />
        </div>
      ) : (
        <div className="table-container">
          <div>
            <h3>Student Ranking</h3>
            <div className="table">
              <ul className="thead">
                <li className="th">
                  <p>Student Name</p>
                  <p>Score</p>
                </li>
              </ul>
              <ul className="tbody">
                {studentScoreResults
                  .sort((a, b) => b.score - a.score)
                  .map((student, i) => (
                    <li className="tr" key={i}>
                      <p className="td name">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="td">{student.score}</p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div>
            <h3>Item Analysis</h3>
            <div className="table">
              <ul className="thead">
                <li className="th">
                  <p>Item</p>
                  <p>Correct</p>
                  <p>Incorrect</p>
                </li>
              </ul>
              <ul className="tbody">
                {itemAnalysis.map((item, i) => (
                  <li className="tr" key={i}>
                    <p className="td">{item.itemNumber}</p>
                    <p className="td">{item.correctCount}</p>
                    <p className="td">{item.incorrectCount}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
