import { BarChart, Bar, XAxis, Tooltip } from "recharts";
import { CardContent } from "../../ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
} from "../../ui/chart";


interface QuizData {
  quizName: string;
  lowScorerCount: number;
  highScorerCount: number;
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
      lowest: quiz.lowScorerCount,
      highest: quiz.highScorerCount,
      total: quiz.totalScore,
    }))
  );

  const chartConfig = {
    lowest: { label: "No. of Lowest Scorer", color: "#6ce5e8" },
    highest: { label: "No. of Highest Scorer", color: "#41b8d5" },
    total: { label: "Total Score", color: "#5680e9" },
  };
  return (
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="quiz"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Bar
            dataKey="lowest"
            stackId="a"
            fill="var(--color-lowest)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="highest"
            stackId="a"
            fill="var(--color-highest)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="total"
            stackId="a"
            fill="var(--color-total)"
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
