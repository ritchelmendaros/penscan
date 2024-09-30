import Gradients from "../../Common/Gradients";
import Header from "../../Common/Header";
import ClassFiles from "../../Student/Class/ClassFiles";
import SmilingRobot from "../../Common/SmilingRobot";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

const Classes = () => {
  const [refreshScores, setRefreshScores] = useState(false);

  useEffect(() => {
    if (refreshScores) {
      setRefreshScores(false); 
    }
  }, [refreshScores]);

  return (
    <div className="Class Main MainContent">
      <Header />
      <main>
        <div className="btn-container">
          <div>Class Quizzes</div>
        </div>
        <ClassFiles key={refreshScores ? "refresh" : "no-refresh"} />
      </main>

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default Classes;
