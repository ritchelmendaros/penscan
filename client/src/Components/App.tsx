import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/App.scss";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./Authentication/Login";
import Dashboard from "./Dashboard/Dashboard";
import CreateClass from "./Teacher/CreateClass";
import NotFoundPage from "./NotFoundPage/NotFoundPage";
import Class from "./Teacher/Class/Class";
import AddStudent from "./Teacher/Class/ClassStudents/AddStudent";
import AddQuiz from "./Teacher/Class/ClassFiles/AddQuiz";
import Signup from "./Authentication/Signup";
import { useCurrUser } from "./Context/UserContext";
import Quiz from "./Teacher/Class/Quiz/Quiz";
import QuizResults from "./Teacher/Class/Quiz/QuizResults";
import QuizResultEdit from "./Teacher/Class/Quiz/QuizResultEdit";
import Classes from "./Student/Class/Classes";
import StudentQuizResults from "./Student/Quiz/QuizResult";
import UserProfile from "./UserProfile/UserProfile";
import { useEffect } from "react";
import { getFromLocalStorage } from "../Utils/LocalStorage";
import StudentQuizResultEdit from "./Student/Quiz/QuizResultEdit";
import TeacherDashboardUI from "./Dashboard/TeacherDashboardUI";
import { ThemeProvider } from "./theme-provider";
import TeacherClasses from "./Dashboard/TeacherClasses";

const App = () => {
  const { userType, setUserType, setUser } = useCurrUser();

  useEffect(() => {
    setUserType(getFromLocalStorage("userType"));
    const fname = getFromLocalStorage("firstname");
    const lname = getFromLocalStorage("lastname");
    const utype = getFromLocalStorage("userType");
    const uid = getFromLocalStorage("userid");
    const uname = getFromLocalStorage("username");

    setUser({
      firstname: fname,
      lastname: lname,
      userType: utype,
      userid: uid,
      username: uname,
    });
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            {(userType === "Teacher" || userType === "Student") && (
              <Route path="/user-profile" element={<UserProfile />} />
            )}

            {userType === "Teacher" ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                  path="/dashboard/create-class"
                  element={<CreateClass />}
                />
                <Route path="/dashboard/class" element={<Class />} />
                <Route path="/dashboard/class/quiz" element={<Quiz />} />
                <Route
                  path="/dashboard/class/quiz/quiz-result"
                  element={<QuizResults />}
                />
                <Route
                  path="/dashboard/class/quiz/quiz-result-edit"
                  element={<QuizResultEdit />}
                />
                <Route
                  path="/dashboard/class/add-student"
                  element={<AddStudent />}
                />
                <Route path="/dashboard/class/add-quiz" element={<AddQuiz />} />
                <Route
                  path="/dashboard/teacher"
                  element={<TeacherDashboardUI />}
                />
                <Route
                  path="/dashboard/teacher/classes"
                  element={<TeacherClasses />}
                />
              </>
            ) : userType === "Student" ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/class/:classid" element={<Classes />} />
                <Route
                  path="/dashboard/class/quiz/quiz-result"
                  element={<StudentQuizResults />}
                />
                <Route
                  path="/dashboard/class/quiz/quiz-result-edit"
                  element={<StudentQuizResultEdit />}
                />
              </>
            ) : null}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;