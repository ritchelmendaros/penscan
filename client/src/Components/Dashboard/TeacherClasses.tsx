import { useState, useEffect } from "react";
import { useCurrUser } from "../Context/UserContext";
import { getAllClasses } from "../../apiCalls/classAPIs";
import { ClassInterface } from "../Interface/ClassInterface";
import { useClass } from "../Context/ClassContext";
import "react-toastify/dist/ReactToastify.css";
import TeacherDashboard from "./TeacherDashboard";
import Header from '../Common/Header';
import robot from '../../assets/robot.svg';
import Gradients from '../Common/Gradients';
import { ToastContainer, toast } from 'react-toastify';

const TeacherClasses = () => {
  const [classes, setClasses] = useState<ClassInterface[]>([]);
  const { setClassList } = useClass();
  const { userType, user } = useCurrUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userid) {
      setLoading(true);
      getAllClasses(user.userid)
        .then((classes: ClassInterface[]) => {
          setClasses(classes);
          setClassList(classes);
        })
        .catch((error) => {
          toast.error("Failed to get classes:", error);
        });
    }
  }, [setClassList, user, userType]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      if (user) {
        const classes = await getAllClasses(user.userid);
        setClasses(classes);
        setClassList(classes);
      }
    } catch (error) {
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user, userType]);

  return (
    <div className="Dashboard Main MainContent">
      <Header />
      <main>
          <TeacherDashboard classes={classes} fetchClasses={fetchClasses} />
      </main>

      <img src={robot} alt="" className="robot" />

      <Gradients />
      <ToastContainer />
    </div>
  );
};

export default TeacherClasses;