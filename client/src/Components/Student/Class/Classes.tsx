import Gradients from "../../Common/Gradients";
import Header from "../../Common/Header";
import ClassFiles from "../../Student/Class/ClassFiles";
import SmilingRobot from "../../Common/SmilingRobot";
import { useEffect, useState } from "react";
import { useCurrUser } from "../../../Components/Context/UserContext";
import { studentuploadStudentQuiz } from "../../../apiCalls/studentQuizApi";
import { SyncLoader } from "react-spinners";
import { useQuiz } from "../../Context/QuizContext";
import { ToastContainer, toast } from "react-toastify";

const Classes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useCurrUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { selectedQuiz, setSelectedStudentResult, setStudentScoreResults } =
    useQuiz();
  const [refreshScores, setRefreshScores] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && selectedQuiz) {
      setIsLoading(true);
      try {
        await studentuploadStudentQuiz(selectedQuiz.quizid, user?.userid || "", selectedFile);
        toast.success("File uploaded successfully!");
        setSelectedFile(null);
        setIsModalOpen(false);
        setRefreshScores(true);
      } catch (error) {
        toast.error("File upload failed.");
        setSelectedFile(null);
        setIsModalOpen(false);
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
        setSelectedFile(null);
      }
    } else {
      toast.warn(
        "Please select a file to upload and ensure a quiz is selected."
      );
    }
  };

  return (
    <div className="Class Main MainContent">
      <Header />
      <main>
        <div className="btn-container">
          <div>Class Quizzes</div>
          <div className="studentupload-download">
            <button onClick={() => setIsModalOpen(true)}>Upload</button>
          </div>
        </div>
        <ClassFiles />
      </main>
      {isModalOpen && (
        <div className="modalquiz-overlay">
          <div className="modalquiz-content">
            <h3>Please Upload a File</h3> <br></br>
            <input
              className="modalquiz-input"
              type="file"
              onChange={handleFileChange}
            />
            {isLoading ? (
              <div className="loader">
                <SyncLoader size={10} color={"#416edf"} loading={isLoading} />
              </div>
            ) : (
              <div className="modalquiz-buttons">
                <button className="modalsubmit" onClick={handleUpload}>
                  Submit
                </button>
                <button
                  className="modalcancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <SmilingRobot />
      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default Classes;
