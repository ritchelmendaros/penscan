import React, { useEffect, useState } from "react";
import { fetchStudentsByClassId } from "../../../../apiCalls/studentApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";
import noDataImage from "../../../../assets/nodata.gif";
<<<<<<< HEAD
import { faTrash } from "@fortawesome/free-solid-svg-icons"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteStudentById } from "../../../../apiCalls/studentApi";
=======
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteStudentById } from "../../../../apiCalls/studentApi";
import ConfirmationModal from "../../../../Components/Modal/ConfirmationModal";
>>>>>>> due-date

interface Student {
  userid: string;
  firstname: string;
  lastname: string;
  username: string;
}

interface ClassStudentsProps {
  classId: string;
}
const ClassStudents: React.FC<ClassStudentsProps> = ({ classId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) return;
      try {
        const studentsData = await fetchStudentsByClassId(classId);
        const sortedStudents = studentsData.sort((a: Student, b: Student) =>
          a.lastname.localeCompare(b.lastname)
        );

        setStudents(sortedStudents);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

<<<<<<< HEAD
  const handleDeleteStudent = async (userid: string) => {
    try {
      await deleteStudentById(classId, userid); 
      setStudents(students.filter(student => student.userid !== userid)); 
      toast.success("Student deleted successfully!"); 
    } catch (error) {
      toast.error("Error deleting student");
    }
  };

=======
  const openDeleteModal = (userid: string) => {
    setSelectedStudentId(userid);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedStudentId) return;
    try {
      await deleteStudentById(classId, selectedStudentId);
      setStudents(
        students.filter((student) => student.userid !== selectedStudentId)
      );
      toast.success("Student deleted successfully!");
      setIsModalOpen(false);
      setSelectedStudentId(null);
    } catch (error) {
      toast.error("Error deleting student");
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

>>>>>>> due-date
  return (
    <div className="ClassStudents">
      {loading ? (
        <div className="loader-container">
          <SyncLoader color="#3498db" loading={loading} size={15} />
        </div>
      ) : (
        <div className="table">
          <ul className="thead">
            <li className="tr">
              <p className="th">Lastname</p>
              <p className="th">Firstname</p>
              <p className="th">Username</p>
<<<<<<< HEAD
              <p className="th"></p> 
=======
              <p className="th"></p>
>>>>>>> due-date
            </li>
          </ul>
          <ul className="tbody">
            {students.length === 0 ? (
              <li className="no-data-row">
                <div className="no-data-content">
                  <img src={noDataImage} alt="No data available" />
                </div>
              </li>
            ) : (
              students.map((student) => (
                <li key={student.userid} className="tr">
                  <p className="td">{student.lastname}</p>
                  <p className="td">{`${student.firstname}`}</p>
                  <p className="td">{student.username}</p>
<<<<<<< HEAD
                  <p className="td"> 
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer", color: "red", marginLeft: "250px"}}
                      onClick={() => handleDeleteStudent(student.userid)}
=======
                  <p className="td">
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        cursor: "pointer",
                        color: "red",
                        marginLeft: "250px",
                      }}
                      onClick={() => openDeleteModal(student.userid)}
>>>>>>> due-date
                    />
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message="Are you sure you want to remove this student?"
        loading={loading}
      />
      <ToastContainer />
    </div>
  );
};

export default ClassStudents;
