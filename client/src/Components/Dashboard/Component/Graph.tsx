import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { CardContent } from "../../ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "../../ui/chart";


interface QuizData {
  quizName: string;
  passCount: number;
  failCount: number;
  nearPerfectCount: number;
  totalScore: number;
}

const Graph = ({
  classesData,
  selectedClass,
}: {
  classesData: any[];
  selectedClass: string;
}) => {
  const filteredData =
    selectedClass === "All"
      ? classesData
      : classesData.filter((data) => data.className === selectedClass);

  const chartData = filteredData.flatMap((classData) =>
    classData.quizzes.map((quiz: QuizData) => {
      const total =
        quiz.failCount + quiz.passCount + quiz.nearPerfectCount || 1; 
      return {
        quiz: quiz.quizName,
        failPercentage: (quiz.failCount / total) * 100, 
        passPercentage: (quiz.passCount / total) * 100,
        nearperfectPercentage: (quiz.nearPerfectCount / total) * 100,
        failCount: quiz.failCount,
        passCount: quiz.passCount,
        nearperfectCount: quiz.nearPerfectCount,
      };
    })
  );

  const chartConfig = {
    fail: { label: "Fail", color: "#d65c5c" },
    pass: { label: "Pass", color: "#5c7ad6" },
    nearperfect: { label: "Near Perfect", color: "#6BCB77" },
  };
  

  return (
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData}>
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#888" }}
            domain={[0, 100]} 
            label={{
              value: "Percentage (%)",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "#888",
            }}
          />
          <XAxis
            dataKey="quiz"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Bar
            dataKey="failPercentage"
            stackId="a"
            fill="var(--color-fail)"
            radius={[0, 0, 4, 4]}
            name="Fail"
          />
          <Bar
            dataKey="passPercentage"
            stackId="a"
            fill="var(--color-pass)"
            radius={[0, 0, 0, 0]}
            name="Pass"
          />
          <Bar
            dataKey="nearperfectPercentage"
            stackId="a"
            fill="var(--color-nearperfect)"
            radius={[4, 4, 0, 0]}
            name="Near Perfect"
          />
          <Tooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconSize={12}
            wrapperStyle={{
              paddingTop: "15px",
              fontSize: "12px",
            }}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  );
};

export default Graph;
