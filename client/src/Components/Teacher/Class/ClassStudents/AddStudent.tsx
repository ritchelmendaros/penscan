import { useState, useEffect } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../../../Common/Header";
import BtnWithRobot from "../../../Common/BtnWithRobot";
import Gradients from "../../../Common/Gradients";
import DropdownContainer from "../../../Common/DropdownContainer";
import { fetchAllStudents } from "../../../../apiCalls/userApi";
import { addStudentToClass } from "../../../../apiCalls/studentApi";
import { useClass } from "../../../Context/ClassContext";
import { useNavigate } from "react-router-dom";

interface Student {
  userid: string;
  firstname: string;
  lastname: string;
}

const AddStudent: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { clickedClass } = useClass();
  const classId = clickedClass?.classid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await fetchAllStudents();
        setAllStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
        setErrorMessage("Failed to load students. Please try again.");
      }
    };

    fetchStudents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentName(value);
    setShowDropdown(true);
    setFilteredStudents(
      allStudents.filter((student) =>
        `${student.firstname} ${student.lastname}`
          .toLowerCase()
          .includes(value.toLowerCase())
      )
    );
  };

  const handleDropdownBlur = () => {
    const matchedStudent = allStudents.find(
      (student) => `${student.firstname} ${student.lastname}` === studentName
    );

    if (matchedStudent) {
      setSelectedStudent(matchedStudent);
    } else {
      setSelectedStudent(null);
    }

    setShowDropdown(false);
  };

  const handleAddStudent = async () => {
    if (selectedStudent) {
      if (!classId) {
        setErrorMessage("Class ID is missing. Please try again.");
        return;
      }

      console.log("ci", classId, selectedStudent.userid);
      try {
        const addStudentResponse = await addStudentToClass(
          selectedStudent.userid,
          classId
        );
        console.log("Student added:", addStudentResponse);
        navigate(`/dashboard/class`);
      } catch (error) {
        console.error("Error adding student:", error);
        setErrorMessage("Error adding student. Please try again.");
      }
    } else {
      setErrorMessage("Please select a student before adding.");
    }
  };

  return (
    <div className="AddStudent Main MainContent">
      <Header />
      <main>
        <div className="content">
          <h2>Add Student</h2>
          <DropdownContainer
            icon={faPlus}
            type="text"
            placeholder="Enter Student Name"
            value={studentName}
            onChange={handleInputChange}
            onBlur={handleDropdownBlur}
            list="students"
          />
          <datalist id="students">
            {filteredStudents.map((student) => (
              <option
                key={student.userid}
                value={`${student.firstname} ${student.lastname}`}
              />
            ))}
          </datalist>
          <BtnWithRobot name={"Add"} onClick={handleAddStudent} />{" "}
          {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
        </div>
      </main>

      <Gradients />
    </div>
  );
};

export default AddStudent;
