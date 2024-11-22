import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { CardContent } from "../../ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
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
    classData.quizzes.map((quiz: QuizData) => ({
      quiz: quiz.quizName,
      fail: quiz.failCount,
      pass: quiz.passCount,
      nearperfect: quiz.nearPerfectCount,
      total: quiz.totalScore,
    }))
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
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            allowDecimals={false}
            tick={{ fontSize: 12, fill: "#888" }} 
          />
          <XAxis
            dataKey="quiz"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Bar
            dataKey="fail"
            stackId="a"
            fill="var(--color-fail)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="pass"
            stackId="a"
            fill="var(--color-pass)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="nearperfect"
            stackId="a"
            fill="var(--color-nearperfect)"
            radius={[4, 4, 0, 0]}
          />
          <Tooltip
            content={<ChartTooltipContent />}
            cursor={false}
            defaultIndex={1}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  );
};

export default Graph;
