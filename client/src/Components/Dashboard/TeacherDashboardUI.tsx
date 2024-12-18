import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent } from "../ui/tabs";
import { Users, Notebook, Activity } from "lucide-react";
import Header from "../Common/Header";
import Graph from "./Component/Graph";
import DashboardCard from "./Common/DashboardCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PieChartUI from "./Component/PieChartUI";
import Log from "./Component/Log";
import CalendarUI from "./Component/CalendarUI";
import { Link, useNavigate } from "react-router-dom";
import {
  getTotalClassesByTeacher,
  getTotalQuizzes,
  getTotalStudents,
  getQuizResultsPerClass,
} from "../../apiCalls/classAPIs";
import { useCurrUser } from "../Context/UserContext";
import "@/Components/index.css";
import noDataGif from "../../assets/nodata.gif";

const TeacherDashboardUI = () => {
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [classesData, setClassesData] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>("All");
  const { user } = useCurrUser();
  const teacherId = user?.userid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalClasses = async () => {
      if (!teacherId) {
        console.warn("teacherID is undefined; skipping fetch.");
        return;
      }
      try {
        const total = await getTotalClassesByTeacher(teacherId);
        setTotalClasses(total);
      } catch (error) {
        console.error("Error fetching total classes:", error);
      }
    };

    const fetchTotalQuizzes = async () => {
      if (!teacherId) {
        console.warn("teacherID is undefined; skipping fetch.");
        return;
      }
      try {
        const total = await getTotalQuizzes(teacherId);
        setTotalQuizzes(total);
      } catch (error) {
        console.error("Error fetching total quizzes:", error);
      }
    };

    const fetchTotalStudents = async () => {
      if (!teacherId) {
        console.warn("teacherID is undefined; skipping fetch.");
        return;
      }
      try {
        const total = await getTotalStudents(teacherId);

        setTotalStudents(total);
      } catch (error) {
        console.error("Error fetching total students:", error);
      }
    };

    const fetchQuizResults = async () => {
      if (!teacherId) {
        console.warn("teacherID is undefined; skipping fetch.");
        return;
      }
      try {
        const results = await getQuizResultsPerClass(teacherId);
        const processedData = Object.keys(results).map((key) => {
          if (Array.isArray(results[key]) && results[key].length > 0) {
            return {
              className: key,
              quizzes: results[key].map((quiz: any) => ({
                quizName: quiz.quizName,
                totalScore: quiz.totalItems,
                passCount: quiz.passCount,
                failCount: quiz.failCount,
                nearPerfectCount: quiz.nearPerfectCount,
              })),
            };
          }
          return {
            className: key,
            quizzes: [],
          };
        });
        const sortedClasses = processedData.sort((a, b) =>
          a.className.localeCompare(b.className)
        );
        setClassesData(sortedClasses);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    fetchQuizResults();
    fetchTotalClasses();
    fetchTotalQuizzes();
    fetchTotalStudents();
  }, [teacherId]);

  const handleClassesClick = () => {
    navigate("/dashboard/teacher/classes");
  };

  return (
    <div className="twp TeacherDashboard Main MainContent">
      <div className="w-[100vw]">
        <Header />
      </div>
      <main>
        <Tabs defaultValue="overview" className="space-y-4 pb-10">
          <div className="flex space-x-3">
            <Link to="/dashboard/teacher" className="hover:text-gray-500">
              Overview
            </Link>
            <Link
              to="/dashboard/teacher/classes"
              className="hover:text-gray-500"
            >
              Classes
            </Link>
          </div>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                title="Classes"
                icon={Activity}
                value={totalClasses}
                change={201}
                onClick={handleClassesClick}
              />
              <DashboardCard
                title="Quizzes"
                icon={Notebook}
                value={totalQuizzes}
                change={201}
              />
              <DashboardCard
                title="Students"
                icon={Users}
                value={totalStudents}
                change={201}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Quiz Results</CardTitle>
                  </div>
                  <Select onValueChange={(value) => setSelectedClass(value)}>
                    <SelectTrigger
                      className="w-[160px] rounded-lg sm:ml-auto"
                      aria-label="Select a value"
                    >
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="All" className="rounded-lg">
                        All
                      </SelectItem>

                      {classesData.map((classData, index) => (
                        <SelectItem
                          key={index}
                          value={classData.className}
                          className="rounded-lg"
                        >
                          {classData.className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="pl-2">
                  {classesData.length === 0 ||
                  (selectedClass !== "All" &&
                    !classesData.some(
                      (classData) => classData.className === selectedClass
                    )) ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        marginTop: "10%"
                      }}
                    >
                      <img
                        src={noDataGif}
                        alt="No data found"
                        style={{ width: "250px" }}
                      />
                    </div>
                  ) : (
                    <Graph
                      classesData={classesData}
                      selectedClass={selectedClass}
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  {teacherId && <Log teacherId={teacherId} />}
                </CardContent>
              </Card>

              <Card className="col-span-5">
                <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
                  <CardTitle>No. of students per classes</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {teacherId && <PieChartUI teacherId={teacherId} />}
                </CardContent>
              </Card>

              <Card className="col-span-2">
                <CalendarUI />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboardUI;
