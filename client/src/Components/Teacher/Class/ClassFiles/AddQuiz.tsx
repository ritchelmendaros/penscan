import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faClipboardList,
  faClipboardQuestion,
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
  const [quizName, setQuizName] = useState("");
  const [answers, setAnswers] = useState(Array(3).fill(""));
  const [numItems, setNumItems] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const { user } = useCurrUser();
  const userId = user?.userid;
  const { clickedClass } = useClass();
  const classId = clickedClass?.classid;

  const handleQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizName(e.target.value);
  };

  const handleNumItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = parseInt(e.target.value);
    setNumItems(items);
    setAnswers(Array(items).fill(""));
  };

  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
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

    const answerArray = answers.map((answer, index) => ({
      itemnumber: index + 1,
      answer,
    }));

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
              <div className="answers-container">
                {answers.map((answer, index) => (
                  <div key={index} className="answer-input">
                    <label htmlFor={`answer-${index}`}>
                      Question {index + 1}
                    </label>
                    <input
                      id={`answer-${index}`}
                      type="text"
                      value={answer}
                      onChange={(e) => handleAnswerChange(e, index)}
                      required
                    />
                  </div>
                ))}
              </div>
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
