import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

import Header from "../Common/Header";
import Gradients from "../Common/Gradients";
const TeacherDashboardUI = () => {
  return (
    <div className="TeacherDashboard Main MainContent">
      <Header />
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </main>
      <Gradients />
    </div>
  );
};

export default TeacherDashboardUI;
