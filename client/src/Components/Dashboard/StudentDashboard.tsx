import React from "react";
import { Link } from "react-router-dom";
import Thumbnail from "../Common/Thumbnail";
import { ClassInterface } from "../Interface/ClassInterface";
import { useClass } from "../Context/ClassContext";
import { SyncLoader } from "react-spinners";

interface StudentDashboardProps {
  classes: ClassInterface[];
  loading: boolean;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  classes,
  loading,
}) => {
  const { setClass } = useClass();

  return (
    <div className="StudentDashboard MainContent">
      <div className="title-container">
        <h2>Classes</h2>
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
    </div>
  );
};

export default StudentDashboard;
