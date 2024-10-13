import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import Thumbnail from "../Common/Thumbnail";
import { ClassInterface } from "../Interface/ClassInterface";
import { useClass } from "../Context/ClassContext";
import { SyncLoader } from "react-spinners";
import noDataGif from "../../assets/nodata.gif";
import { ToastContainer, toast } from "react-toastify";
import { editClassName } from "../../apiCalls/classAPIs";

interface TeacherDashboardProps {
  classes: ClassInterface[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps & { fetchClasses: () => Promise<void> }> = ({ classes, fetchClasses }) => {
  const { setClass } = useClass();
  const [loading, setLoading] = useState(true);
  const [activeOptions, setActiveOptions] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editClassNameState, setEditClassName] = useState("");
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  

  useEffect(() => {
    setLoading(false);
  }, [classes]);

  const handleOptionsToggle = (index: number) => {
    setActiveOptions(activeOptions === index ? null : index);
  };

  const handleEdit = (classId: string, classname: string) => {
    setEditingClassId(classId); 
    setEditClassName(classname); 
    setIsModalOpen(true); 
  };

  const handleDelete = (classId: string) => {
    console.log(classId)
    toast("Delete class");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveEdit = async () => {
    if (editingClassId && editClassNameState) {
      try {
        await editClassName(editingClassId, editClassNameState);
        setIsModalOpen(false);
        await fetchClasses(); 
      } catch (error) {
        toast.error("Failed to update class name.");
      }
    }
  };  

  return (
    <div className="TeacherDashboard MainContent">
      <div className="title-container">
        <h2>Classes</h2>
        <Link to="/dashboard/create-class">Create class</Link>
      </div>

      <div>
        {loading ? (
          <div className="loader-container">
            <SyncLoader color="#3498db" loading={loading} size={15} />
          </div>
        ) : (
          <ul className="classes">
            {classes.length > 0 ? (
              classes.map((item, i) => (
                <li key={i}>
                  <Link to="/dashboard/class" onClick={() => setClass(item)}>
                    <Thumbnail name={item.classname} />
                  </Link>
                  <div className="options-container">
                    <button
                      className="three-dots"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOptionsToggle(i);
                      }}
                    >
                      &#x22EE;
                    </button>
                    {activeOptions === i && (
                      <div className="options-menu">
                        <button
                          onClick={() =>
                            handleEdit(item.classid, item.classname)
                          }
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.classid)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <div className="empty-state">
                <img src={noDataGif} alt="No data" />
              </div>
            )}
          </ul>
        )}
      </div>
      <ToastContainer/>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Classname</h2>
            <input
              type="text"
              value={editClassNameState}
              onChange={(e) => setEditClassName(e.target.value)}
              placeholder="Enter class name"
            />
            <div className="button-container">
              <button className="modal-buttonsubmit" onClick={handleSaveEdit}>Submit</button>
              <button className="modal-button" onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
          <div className="modal-overlay" onClick={handleModalClose} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
