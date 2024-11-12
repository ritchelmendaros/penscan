import { useEffect, useState } from "react";
import { useQuiz } from "../../../Context/QuizContext";
import { getQuizAnalysis } from "../../../../apiCalls/QuizAPIs";
import { ItemAnalysisInterface } from "../../../Interface/Quiz";
import { SyncLoader } from "react-spinners";
import noDataGif from "../../../../assets/nodata.gif";

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
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {studentScoreResults
                  .sort((a, b) => b.score - a.score)
                  .map((student, i) => (
                    <tr key={i}>
                      <td className="td name">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="td">{student.finalScore}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>Item Analysis</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>P</th>
                  <th>Difficulty</th>
                  <th>D</th>
                  <th>Discrimination</th>
                  <th>Suggested</th>
                </tr>
              </thead>
              <tbody>
                {itemAnalysis.length > 0 ? (
                  itemAnalysis.map((item, i) => (
                    <tr key={i}>
                      <td className="td">{item.itemNumber}</td>
                      <td className="td">{item.correctCount}</td>
                      <td className="td">{item.incorrectCount}</td>
                      <td className="td">{item.difficultyIndex}</td>
                      <td className="td">{item.difficultyInterpretation}</td>
                      <td className="td">{item.discriminationIndex}</td>
                      <td className="td">{item.discriminationInterpretation}</td>
                      <td className="td">{item.suggestedDecision}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="no-data-container">
                    <td>
                      <img src={noDataGif} alt="No data found" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
