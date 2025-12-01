import React from "react";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import { CardContent, CardFooter } from "./ui/card";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

const QuizResult = ({ result, hideStartNew = false, onStartNew }) => {
  if (!result) return null;
  return (
    <div className={"mx-auto"}>
      <h1 className={"flex items-center gap-2 text-3xl gradient-title"}>
        <Trophy className={"h-6 w-6 text-yellow-500"} />
        Quiz Result
      </h1>

      <CardContent>
        <div className={"text-center space-y-2"}>
          <h3>{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className={"w-full"} />
        </div>

        {/*Improvement Tip*/}
        {result.improvementTip && (
          <div className={"bg-muted p-4 rounded-lg"}>
            <p className={"font-medium"}>Improvement Tip:</p>
            <p className={"text-muted-foreground"}>{result.improvementTip}</p>
          </div>
        )}

        <div className={"space-y-4"}>
          <h3 className={"font-medium text-lg mt-4"}>Question Review</h3>
          {result.questions.map((question, index) => (
            <div className={"border rounded-lg p-4 space-y-2"} key={index}>
              <div className={"flex items-start justify-between gap-2"}>
                <p>
                  {question.isCorrect ? (
                    <CheckCircle2
                      className={"h-5 w-5 text-green-500 flex-shrink-0"}
                    />
                  ) : (
                    <XCircle className={"h-5 w-5 text-red-500 flex-shrink-0"} />
                  )}
                </p>
              </div>

              <div className={"text-sm text-muted-foreground"}>
                <p>Your answer: {question.userAnswer}</p>
                {!question.isCorrect && (
                  <p>Correct answer: {question.answer}</p>
                )}
              </div>

              <div className={"text-sm bg-muted p-2 rounded"}>
                <p className={"font-medium"}>Explanation:</p>
                <p>{question.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter onClick={onStartNew} className={"w-full"}>
          <Button className={"w-full mt-4"}>Start New Quiz</Button>
        </CardFooter>
      )}
    </div>
  );
};
export default QuizResult;
