import { Bar, BarChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart"

const chartData = [
  { date: "2024-07-15", lowest: 450, highest: 300, total: 500 },
  { date: "2024-07-16", lowest: 380, highest: 420, total: 500 },
  { date: "2024-07-17", lowest: 520, highest: 120, total: 500 },
  { date: "2024-07-18", lowest: 140, highest: 550, total: 500 },
  { date: "2024-07-19", lowest: 600, highest: 350, total: 500 },
  { date: "2024-07-20", lowest: 480, highest: 400, total: 500 },
]

const chartConfig: ChartConfig = {
  lowest: {
    label: "Lowest",
    color: "#6ce5e8",
  },
  highest: {
    label: "Highest",
    color: "#41b8d5",
  },
  total: {
    label: "Total",
    color: "#5680e9",
  },
}

const Graph = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart with Tooltip</CardTitle>
        <CardDescription>
          Bar chart with default tooltip and custom tooltip content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
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
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="total"
              stackId="a"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Graph