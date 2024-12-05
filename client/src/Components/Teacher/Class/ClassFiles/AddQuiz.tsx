import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQuestionCircle,
  faClipboardList,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import Gradients from "../../../Common/Gradients";
import Header from "../../../Common/Header";
import BtnWithRobot from "../../../Common/BtnWithRobot";
import { useNavigate } from "react-router-dom";
import { addQuiz } from "../../../../apiCalls/QuizAPIs";
import { useCurrUser } from "../../../Context/UserContext";
import { useClass } from "../../../Context/ClassContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmationModal from "../../../Modal/ConfirmationModal";
import BackBtn from "../../../Common/BackBtn";

const AddQuiz = () => {
  const [quizName, setQuizName] = useState("");
  const [answers, setAnswers] = useState(Array(3).fill(""));
  const [numItems, setNumItems] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [dueDate, setDueDate] = useState("");
  const { user } = useCurrUser();
  const userId = user?.userid;
  const { clickedClass } = useClass();
  const [isLoading, setIsLoading] = useState(false); 
  const classId = clickedClass?.classid;

  const handleQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizName(e.target.value);
  };

  const updateQuestionsCount = (newCount: number) => {
    const validCount = Math.max(1, newCount);
    setNumItems(validCount);
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      while (newAnswers.length < validCount) {
        newAnswers.push("");
      }
      return newAnswers.slice(0, validCount);
    });
  };

  const handleNumItemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const items = parseInt(e.target.value);
    setNumItems(items);
    setAnswers(Array(items).fill(""));
  };

  const handleIncrementQuestions = () => {
    updateQuestionsCount(numItems + 1);
  };

  const handleDecrementQuestions = () => {
    updateQuestionsCount(numItems - 1);
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

    setIsLoading(true);
    try {
      await addQuiz(classId, quizName, userId, answerArray, dueDate, numItems);
      navigate(`/dashboard/class`);
    } catch (error) {
      toast.error("Error adding quiz. Please try again.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const cancelAddQuiz = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="AddQuiz Main MainContent">
      <BackBtn />
      <Header />
      <main>
        <div className="content">
          <div className="quiz-creation-form">
            <h2>Create Quiz Answer Key</h2>
            <form onSubmit={handleAddQuiz}>
              <div className="input-group">
                <label htmlFor="quiz-title">Quiz Title</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon
                    icon={faClipboardList}
                    className="input-icon"
                  />
                  <input
                    id="quiz-title"
                    type="text"
                    value={quizName}
                    onChange={handleQuizNameChange}
                    placeholder="Enter the title of your quiz"
                    required
                  />
                </div>
              </div>
              <div className="due-date-items-row">
                <div className="input-group half-width">
                  <label htmlFor="due-date">Due Date</label>
                  <div className="input-wrapper">
                    <input
                      id="due-date-time"
                      type="datetime-local"
                      value={dueDate}
                      className="date-picker"
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="input-group half-width">
                  <label htmlFor="num-questions">Number of Items</label>
                  <div className="input-wrapper">
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      className="input-icon"
                    />
                    <input
                      id="num-questions"
                      type="number"
                      value={numItems}
                      onChange={handleNumItemsChange}
                      min="1"
                      placeholder="How many items in your quiz?"
                      style={{ appearance: "textfield" }}
                      required
                    />
                    <div className="number-controls">
                      <button type="button" onClick={handleDecrementQuestions}>
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <button type="button" onClick={handleIncrementQuestions}>
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="answers-container">
                {answers.map((answer, index) => (
                  <div key={index} className="answer-input">
                    <label htmlFor={`answer-${index}`}>Item {index + 1}</label>
                    <input
                      id={`answer-${index}`}
                      type="text"
                      value={answer}
                      onChange={(e) => handleAnswerChange(e, index)}
                      placeholder={`Type item answer here`}
                      required
                    />
                  </div>
                ))}
              </div>
              <BtnWithRobot name={"Create Quiz"} />
            </form>
          </div>
        </div>
      </main>

      <Gradients />
      <ToastContainer />
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmAddQuiz}
        onCancel={cancelAddQuiz}
        message={modalMessage}
        loading={isLoading} 
      />
    </div>
  );
};

export default AddQuiz;
