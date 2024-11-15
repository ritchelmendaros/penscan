import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import { CardContent } from "../../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../ui/chart";
const chartData = [
  { quiz: "quiz1", students: 275, fill: "var(--color-quiz1)" },
  { quiz: "quiz2", students: 200, fill: "var(--color-quiz2)" },
  { quiz: "quiz3", students: 187, fill: "var(--color-quiz3)" },
  { quiz: "quiz4", students: 173, fill: "var(--color-quiz4)" },
];

const chartConfig = {
  students: {
    label: "Students",
  },
  quiz1: {
    label: "Quiz 1",
    color: "hsl(var(--chart-1))",
  },
  quiz2: {
    label: "Quiz 2",
    color: "hsl(var(--chart-2))",
  },
  quiz3: {
    label: "Quiz 3",
    color: "hsl(var(--chart-3))",
  },
  quiz4: {
    label: "Quiz 4",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const PieChartUI = () => {
  return (
    <div className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="students" hideLabel />}
            />
            <Pie data={chartData} dataKey="students"></Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="quiz" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
};

export default PieChartUI;
