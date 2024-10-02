import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import Gradients from "../../../Common/Gradients";
import Header from "../../../Common/Header";
import InputContainer from "../../../Common/InputContainer";
import BtnWithRobot from "../../../Common/BtnWithRobot";
import { useNavigate } from "react-router-dom";
import { addQuiz } from "../../../../apiCalls/QuizAPIs";
import { useCurrUser } from "../../../Context/UserContext";
import { useClass } from "../../../Context/ClassContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../../../Modal/ConfirmationModal";

const AddQuiz = () => {
  const [quizName, setQuizName] = useState<string>("");
  const [answerKey, setAnswerKey] = useState<string>("");
  const [numItems, setNumItems] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const navigate = useNavigate();

  const { user } = useCurrUser();
  const userId = user?.userid;
  const { clickedClass } = useClass();
  const classId = clickedClass?.classid;

  const handleQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizName(e.target.value);
  };

  const handleAnswerKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerKey(e.target.value);
  };

  const handleNumItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = parseInt(e.target.value);
    setNumItems(items);

    const generatedAnswers = Array.from(
      { length: items },
      (_, i) => `${i + 1}. `
    ).join("\n");

    setAnswerKey(generatedAnswers);
  };

  const handleAddQuiz = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModalMessage("Are you sure you want to add this quiz?");
    setIsModalOpen(true);
  };

  const confirmAddQuiz = async () => {
    if (!classId || !userId) {
      toast.error("Class ID or User ID is missing.");
      return;
    }
    const answerArray = answerKey.split("\n").map((line) => {
      const [itemnumber, ...answerParts] = line.split(".");
      const answer = answerParts.join(".").trim();
      return {
        itemnumber: parseInt(itemnumber.trim()),
        answer,
      };
    });
    try {
      await addQuiz(classId, quizName, userId, answerArray);
      navigate(`/dashboard/class`);
    } catch (error) {
      toast.error("Error adding quiz. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const cancelAddQuiz = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="AddQuiz Main MainContent">
      <Header />
      <main>
        <div className="content">
          <form onSubmit={handleAddQuiz}>
            <h2>Add Quiz</h2>
            <InputContainer
              icon={faClipboardList}
              placeholder={"Quiz Name"}
              value={quizName}
              onChange={handleQuizNameChange}
            />

            <div className="input-container">
              <FontAwesomeIcon icon={faQuestionCircle} className="input-icon" />
              <input
                type="number"
                placeholder="Number of Quiz Items"
                value={numItems}
                onChange={handleNumItemsChange}
                className="full-width-input"
                required
              />
            </div>
            <div className="input-container">
              <textarea
                id="answerKey"
                className="InputContainer"
                value={answerKey}
                onChange={handleAnswerKeyChange}
                placeholder="Enter answer key"
                rows={10}
                style={{ resize: "vertical", color: "white" }}
              />
            </div>

            <BtnWithRobot name={"Add"} />
          </form>
        </div>
      </main>

      <Gradients />
      <ToastContainer />
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmAddQuiz}
        onCancel={cancelAddQuiz}
        message={modalMessage}
      />
    </div>
  );
};

export default AddQuiz;
