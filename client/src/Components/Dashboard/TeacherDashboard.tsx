import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Thumbnail from "../Common/Thumbnail";
import { ClassInterface } from "../Interface/ClassInterface";
import { useClass } from "../Context/ClassContext";
import { SyncLoader } from "react-spinners";
import noDataGif from "../../assets/nodata.gif";

interface TeacherDashboardProps {
  classes: ClassInterface[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ classes }) => {
  const { setClass } = useClass();
  const [loading, setLoading] = useState(true);
  const [activeOptions, setActiveOptions] = useState<number | null>(null);

  useEffect(() => {
    setLoading(false);
  }, [classes]);

  const handleOptionsToggle = (index: number) => {
    setActiveOptions(activeOptions === index ? null : index);
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
                <Link to="/dashboard/class" key={i}>
                  <li onClick={() => setClass(item)}>
                    <Thumbnail name={item.classname} />
                  </li>
                </Link>

                
              ))
            ) : (
              <div className="empty-state">
                <img src={noDataGif} alt="No data" />
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
