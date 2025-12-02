"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import QuizResult from "./QuizResult";

const QuizList = ({ assessments }) => {
  const router = useRouter();
  const [selectQuiz, setSelectQuiz] = useState(null);
  return (
    <>
      <Card>
        <CardHeader className={"flex flex-row items-center justify-between"}>
          <div>
            <CardTitle className={"gradient-title text-3xl md:text-4xl"}>
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review your past quiz performance</CardDescription>
          </div>

          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className={"space-y-4"}>
            {assessments.map((assessment, i) => {
              return (
                <Card
                  key={assessment.id}
                  className={
                    "cursor-pointer hover:bg-muted/50 transition-colors"
                  }
                  onClick={() => setSelectQuiz(assessment)}
                >
                  <CardHeader>
                    <CardTitle>Quiz {i + 1}</CardTitle>
                    <CardDescription className={"flex justify-between w-full"}>
                      <div>Score: {assessment.quizScore.toFixed(1)}%</div>
                      <div>
                        {format(
                          new Date(assessment.createdAt),
                          "MMMM dd, yyyy - HH:mm",
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className={"text-sm text-muted-foreground"}>
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectQuiz} onOpenChange={() => setSelectQuiz(null)}>
        <DialogContent className={"max-w-3xl max-h-[90vh] overflow-y-auto"}>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectQuiz}
            onStartNew={() => router.push("/interview/mock")}
            hideStartNew
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default QuizList;
