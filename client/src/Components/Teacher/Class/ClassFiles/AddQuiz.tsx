import { useState } from "react";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Gradients from "../../../Common/Gradients";
import Header from "../../../Common/Header";
import InputContainer from "../../../Common/InputContainer";
import BtnWithRobot from "../../../Common/BtnWithRobot";
import { Link } from "react-router-dom";

const AddQuiz = () => {
  const [quizName, setQuizName] = useState("");
  const [answerKey, setAnswerKey] = useState("");

  const handleQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizName(e.target.value);
  };

  const handleAnswerKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerKey(e.target.value);
  };

  return (
    <div className="AddQuiz Main MainContent">
      <Header />
      <main>
        <div className="content">
          <h2>Add Quiz</h2>
          <InputContainer
            icon={faClipboardList}
            placeholder={"Quiz Name"}
            value={quizName}
            onChange={handleQuizNameChange}
          />

          <form action="" onSubmit={(e) => e.preventDefault()}>
            <div className="input-container">
              <textarea
                id="answerKey"
                className="InputContainer"
                value={answerKey}
                onChange={handleAnswerKeyChange}
                placeholder="Enter answer key"
                rows={10}
                style={{ resize: "vertical" }}
              />
            </div>

            <Link to={"/dashboard/class/"}>
              <BtnWithRobot name={"Add"} />
            </Link>
          </form>
        </div>
      </main>

      <Gradients />
    </div>
  );
};

export default AddQuiz;
