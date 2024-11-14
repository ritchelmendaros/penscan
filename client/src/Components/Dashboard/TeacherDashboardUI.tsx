import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Users, Notebook } from "lucide-react";
import Header from "../Common/Header";
import Graph from "./Common/Graph";
import DashboardCard from "./Common/DashboardCard";
import { useState } from "react";


const TeacherDashboardUI = () => {
  return (
    <div className="TeacherDashboard Main MainContent">
      <Header />
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
                icon={Users}
                value={6}
                change={201}
              />
              <DashboardCard
                title="Quizzes"
                icon={Notebook}
                value={573}
                change={201}
              />
              {/* <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              /> */}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Graph />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboardUI;
