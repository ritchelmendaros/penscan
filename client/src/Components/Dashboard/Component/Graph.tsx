import { BarChart, Bar, XAxis, Tooltip } from "recharts";
import {
  CardContent,
} from "../../ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
} from "../../ui/chart";

const chartData = [
  { quiz: "Quiz 1", lowest: 450, highest: 300, total: 500 },
  { quiz: "Quiz 2", lowest: 380, highest: 420, total: 500 },
  { quiz: "Quiz 3", lowest: 520, highest: 120, total: 500 },
  { quiz: "Quiz 4", lowest: 140, highest: 550, total: 500 },
  { quiz: "Quiz 5", lowest: 600, highest: 350, total: 500 },
  { quiz: "Quiz 6", lowest: 480, highest: 400, total: 500 },
];

const chartConfig = {
  lowest: { label: "Lowest", color: "#6ce5e8" },
  highest: { label: "Highest", color: "#41b8d5" },
  total: { label: "Total", color: "#5680e9" },
};

const Graph = () => {
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