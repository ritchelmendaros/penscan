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
import { toast, ToastContainer } from 'react-toastify'; 
import BackBtn from "../../../Common/BackBtn";
import 'react-toastify/dist/ReactToastify.css';
interface Student {
  userid: string;
  username: string;
  firstname: string;
  lastname: string;
}

const AddStudent: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
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
        toast.error("Error fetching students");
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

    const username = studentName.split(" ").pop();
    const matchedStudent = allStudents.find(
      (student) => `${student.username}` === username
    );

    if (matchedStudent) {
      setSelectedStudent(matchedStudent);
    } else {
      setSelectedStudent(null);
    }

    setShowDropdown(false);
    console.log(showDropdown)
  };

  const handleAddStudent = async () => {
    if (selectedStudent) {
      if (!classId) {
        toast.error("Class ID is missing. Please try again.");
        return;
      }
      setLoading(true); 
      try {
        await addStudentToClass(
          selectedStudent.userid,
          classId
        );
        toast.dark("Student added successfully!"); 
            setTimeout(() => {
                navigate(`/dashboard/class`); 
            }, 500);
      } catch (error) {
        setLoading(false);
        toast.error("Error adding student");
      }
    } else {
      toast.error("Please select a student before adding.");
    }
  };

  return (
    <div className="AddStudent Main MainContent">
      <Header />
      <div className="back-btn">
        <BackBtn />
      </div>
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
                value={`${student.firstname} ${student.lastname} - ${student.username}`}
              />
            ))}
          </datalist>
          <BtnWithRobot name={"Add"} onClick={handleAddStudent} loading={loading}/>{" "}
        </div>
      </main>

      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default AddStudent;
