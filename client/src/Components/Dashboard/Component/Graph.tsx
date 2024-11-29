import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { CardContent } from "../../ui/card";
import React, { useState } from "react";
import { ChartContainer, ChartTooltipContent } from "../../ui/chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface QuizData {
  quizName: string;
  passCount: number;
  failCount: number;
  nearPerfectCount: number;
  totalScore: number;
}

const ITEMS_PER_PAGE = 7;

const Graph = ({
  classesData,
  selectedClass,
}: {
  classesData: any[];
  selectedClass: string;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

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
        failPercentage: parseFloat(((quiz.failCount / total) * 100).toFixed(2)),
        passPercentage: parseFloat(((quiz.passCount / total) * 100).toFixed(2)),
        nearperfectPercentage: parseFloat(
          ((quiz.nearPerfectCount / total) * 100).toFixed(2)
        ),
        failCount: quiz.failCount,
        passCount: quiz.passCount,
        nearperfectCount: quiz.nearPerfectCount,
      };
    })
  );

  const totalPages = Math.ceil(chartData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = chartData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const chartConfig = {
    fail: { label: "Fail", color: "#d65c5c" },
    pass: { label: "Pass", color: "#5c7ad6" },
    nearperfect: { label: "Near Perfect", color: "#6BCB77" },
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart data={currentData}>
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
      <div style={{ textAlign: "center", marginTop: "10px" }}>
      <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            marginRight: "10px",
            background: "none",
            border: "none",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <span style={{fontSize:"12PX"}}>
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            marginLeft: "10px",
            background: "none",
            border: "none",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
    </CardContent>
  );
};

export default Graph;
