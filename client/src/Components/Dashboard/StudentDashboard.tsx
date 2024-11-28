import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Thumbnail from "../Common/Thumbnail";
import { ClassInterface } from "../Interface/ClassInterface";
import { useClass } from "../Context/ClassContext";
import { SyncLoader } from "react-spinners";
import { joinClass } from "@/apiCalls/classAPIs";
import { useCurrUser } from "../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface StudentDashboardProps {
  classes: ClassInterface[];
  loading: boolean;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  classes,
  loading,
}) => {
  const { setClass } = useClass();
  const { user } = useCurrUser();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classCode, setClassCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {
    setIsModalOpen(false);
    setClassCode("");
    setErrorMessage("");
  };

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      toast.error("Class code cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      if (user?.userid) {
        await joinClass(user?.userid, classCode);
        setIsModalOpen(false);
        navigate("/dashboard");
        toast.success("Successfully joined the class!");
      } else {
        toast.error("No student ID available.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to join the class.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="StudentDashboard MainContent">
      <div className="title-container">
        <h2>Classes</h2>
        <button className="add-btn" onClick={handleModalOpen}>Join Class</button>
      </div>

      <div>
        {loading ? (
          <div className="loader">
            <SyncLoader color="#416edf" />
          </div>
        ) : (
          <ul className="classes">
            {classes.length > 0 ? (
              classes.map((item, i) => (
                <Link to={`/dashboard/class/${item.classid}`} key={i}>
                  <li onClick={() => setClass(item)}>
                    <Thumbnail name={item.classname} />
                  </li>
                </Link>
              ))
            ) : (
              <h1 className="empty-state">Enroll in a class first.</h1>
            )}
          </ul>
        )}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Join Class by Class Code</h2>
            <input
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Enter class code"
            />
            <div className="button-container">
              <button
                className="modal-buttonsubmit"
                onClick={handleJoinClass}
                disabled={isLoading}
              >
                {isLoading ? (
                  <SyncLoader color="#fff" loading={isLoading} size={7} />
                ) : (
                  "Submit"
                )}
              </button>
              <button className="modal-button" onClick={handleModalClose}>
                Cancel
              </button>
            </div>
          </div>
          <div className="modal-overlay" onClick={handleModalClose} />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
