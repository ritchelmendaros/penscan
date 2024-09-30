import React, { useEffect, useState } from "react";
import { fetchStudentsByClassId } from "../../../../apiCalls/studentApi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners";
import noDataImage from "../../../../assets/nodata.gif";

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
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ClassStudents;
