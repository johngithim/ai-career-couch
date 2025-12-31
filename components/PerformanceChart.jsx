"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Trophy } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PerformanceChart = ({ assessments }) => {
  const computedChartData = useMemo(() => {
    if (assessments && Array.isArray(assessments) && assessments.length > 0) {
      return assessments
        .filter(
          (assessment) =>
            assessment && assessment.createdAt && assessment.quizScore != null,
        )
        .map((assessment) => ({
          date: format(new Date(assessment.createdAt), "MMM dd"),
          score: Number(assessment.quizScore) || 0,
        }));
    } else {
      return [];
    }
  }, [assessments]);

  return (
    <div>
      <Card>
        <CardHeader
          className={
            "flex flex-row items-center justify-between space-y-0 pb-2"
          }
        >
          <CardTitle className={"gradient-title text-3xl md:text-4xl"}>
            Performance Trend
          </CardTitle>
          <CardDescription>Your Quiz scores over time</CardDescription>
          <Trophy className={`h-4 w-4 text-muted-foreground`} />
        </CardHeader>
        <CardContent>
          <div className={"h-[300px]"}>
            <ResponsiveContainer width={"100%"} height={"100%"}>
              <LineChart data={computedChartData}>
                <CartesianGrid strokeDasharray={"3 3"} />
                <XAxis dataKey={"date"} />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload?.length) {
                      return (
                        <div
                          className={
                            "bg-background border rounded-lg p-2 shadow-md"
                          }
                        >
                          <p className={"text-sm font-medium"}>
                            Score: {payload[0].value}%
                          </p>
                          <p className={"text-xs text-muted-foreground"}>
                            {payload[0].payload.date}
                          </p>
                        </div>
                      );
                    }
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={"score"}
                  stroke={"white"}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default PerformanceChart;
