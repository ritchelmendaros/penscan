import { useEffect, useState } from "react";
import Gradients from "../../Common/Gradients";
import Header from "../../Common/Header";
import { Link } from "react-router-dom";
import ClassFiles from "./ClassFiles/ClassFiles";
import ClassStudents from "./ClassStudents/ClassStudents";
import SmilingRobot from "../../Common/SmilingRobot";
import BackBtn from "../../Common/BackBtn";
import { useClass } from "../../Context/ClassContext";
import {
  getArrayFromLocalStorage,
  getFromLocalStorage,
  saveArrayToLocalStorage,
  setLocalStorage,
} from "../../../Utils/LocalStorage";

const Class = () => {
  const [option, setOption] = useState("class-files");
  const { clickedClass, setClass } = useClass();

  useEffect(() => {
    if (clickedClass) {
      setLocalStorage("classCode", clickedClass.classCode);
      setLocalStorage("classid", clickedClass.classid);
      setLocalStorage("classname", clickedClass.classname);
      saveArrayToLocalStorage("studentid", clickedClass.studentid);
      setLocalStorage("teacherid", clickedClass.teacherid);
    } else {
      const classCode = getFromLocalStorage("classCode") || "";
      const classid = getFromLocalStorage("classid");
      const classname = getFromLocalStorage("classname");
      const studentid = getArrayFromLocalStorage("studentid");
      const teacherid = getFromLocalStorage("teacherid");
  
      setClass({
        classCode,
        classid,
        classname,
        studentid,
        teacherid,
        isactive: 1,
      });
    }
  }, [clickedClass, setClass]);
  

  return (
    <div className="Class Main MainContent">
      <BackBtn />
      <Header />
      <main>
        <div className="btn-container">
          <div className="option-buttons">
            <button
              onClick={() => setOption("class-files")}
              className={option === "class-files" ? "active" : "inactive"}
            >
              Class Files
            </button>
            <button
              onClick={() => setOption("students")}
              className={option === "students" ? "active" : "inactive"}
            >
              Students
            </button>
          </div>

          <div className="class-code">
            <h5>Class Code: {clickedClass?.classCode}</h5>
          </div>

          {option === "class-files" ? (
            <Link to={"/dashboard/class/add-quiz"}>
              <button className="add-btn">Add Quiz</button>
            </Link>
          ) : (
            <Link to={"/dashboard/class/add-student"}>
              <button className="add-btn">Add Student</button>
            </Link>
          )}
        </div>

        {option === "class-files" && <ClassFiles />}
        {option === "students" && clickedClass && (
          <ClassStudents classId={clickedClass.classid} />
        )}
      </main>
      <SmilingRobot />
      <Gradients />
    </div>
  );
};

export default Class;
