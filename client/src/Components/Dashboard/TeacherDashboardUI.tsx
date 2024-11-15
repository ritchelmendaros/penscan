import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Users, Notebook, Activity } from "lucide-react";
import Header from "../Common/Header";
import Graph from "./Common/Graph";
import DashboardCard from "./Common/DashboardCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import PieChartUI from "./Common/PieChartUI";
import Log from "./Common/Log";

const TeacherDashboardUI = () => {
  return (
    <div className="TeacherDashboard Main MainContent">
      <div className="w-[100vw]">
        <Header />
      </div>
      <main>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                title="Classes"
                icon={Activity}
                value={6}
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
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboardUI;
