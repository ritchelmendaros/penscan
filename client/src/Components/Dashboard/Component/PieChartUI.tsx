import { Pie, PieChart, Legend } from "recharts";
import { useEffect, useState } from "react";
import { CardContent } from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import { getTotalStudentsPerClass } from "../../../apiCalls/classAPIs";

interface PieChartUIProps {
  teacherId: string;
}

const PieChartUI = ({ teacherId }: PieChartUIProps) => {
  const [studentsData, setStudentsData] = useState<
    { className: string; students: number }[]
  >([]);

  useEffect(() => {
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

    fetchTotalStudents();
  }, [teacherId]);

  const generateColor = (index: number) => {
    const hue = (index * 45) % 360;
    const saturation = 60;
    const lightness = 60 + (index % 5) * 5;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const chartData = studentsData.map((item, index) => ({
    className: item.className,
    students: item.students,
    fill: generateColor(index),
  }));

  const chartConfig = {
    students: {
      label: "Students",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="className" />}
            />
            <Pie data={chartData} dataKey="students" nameKey="className"></Pie>
            <Legend
              payload={chartData.map((item) => ({
                value: item.className,
                type: "square",
                color: item.fill,
              }))}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
};

export default PieChartUI;
