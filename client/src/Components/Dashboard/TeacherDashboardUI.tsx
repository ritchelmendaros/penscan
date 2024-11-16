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
import { Link } from "react-router-dom";
import {
  getTotalClassesByTeacher,
  getTotalStudentsPerClass,
} from "../../apiCalls/classAPIs";
import { useCurrUser } from "../Context/UserContext";

const TeacherDashboardUI = () => {
  const [totalClasses, setTotalClasses] = useState<number>(0);
  const [studentsData, setStudentsData] = useState<
    { className: string; students: number }[]
  >([]);
  const { user } = useCurrUser();
  const teacherId = user?.userid;

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

    const fetchTotalStudents = async () => {
      if (!teacherId) {
        console.warn("teacherID is undefined; skipping fetch.");
        return;
      }
      try {
        const studentsCountResponse = await getTotalStudentsPerClass(teacherId);

        const formattedData = studentsCountResponse.map(
          (item: { className: string; studentCount: number }) => ({
            className: item.className,
            students: item.studentCount,
          })
        );
        setStudentsData(formattedData);
      } catch (error) {
        console.error("Error fetching total students:", error);
      }
    };

    fetchTotalClasses();
    fetchTotalStudents();
  }, [teacherId]);

  return (
    <div className="TeacherDashboard Main MainContent">
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
              />
              <DashboardCard
                title="Quizzes"
                icon={Notebook}
                value={573}
                change={201}
              />
              <DashboardCard
                title="Students"
                icon={Users}
                value={573}
                change={201}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader className="flex items-center gap-2 space-y-0 py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Quiz Results</CardTitle>
                  </div>
                  <Select>
                    <SelectTrigger
                      className="w-[160px] rounded-lg sm:ml-auto"
                      aria-label="Select a value"
                    >
                      <SelectValue placeholder="Quiz 1" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="90d" className="rounded-lg">
                        Quiz 1
                      </SelectItem>
                      <SelectItem value="30d" className="rounded-lg">
                        Quiz 2
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="pl-2">
                  <Graph />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <Log />
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
