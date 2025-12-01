This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



"use client";

import {
Card,
CardContent,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

const QuizResult = ({ result, onStartNew }) => {
if (!result) {
return null;
}

const score = result.quizScore || 0;
const questions = result.questions || [];
const correctCount = questions.filter((q) => q.isCorrect).length;
const totalQuestions = questions.length;
const incorrectCount = totalQuestions - correctCount;

const getScoreColor = (score) => {
if (score >= 80) return "text-green-600";
if (score >= 60) return "text-yellow-600";
return "text-red-600";
};

const getScoreLabel = (score) => {
if (score >= 80) return "Excellent!";
if (score >= 60) return "Good Job!";
return "Keep Practicing!";
};

return (
<Card className="mx-2 my-4">
<CardHeader>
<CardTitle className="text-2xl">Quiz Results</CardTitle>
<CardDescription>Here's how you performed</CardDescription>
</CardHeader>
<CardContent className="space-y-6">
{/* Score Display */}
<div className="text-center space-y-2">
<div className={`text-5xl font-bold ${getScoreColor(score)}`}>
{score.toFixed(1)}%
</div>
<p className="text-lg font-medium">{getScoreLabel(score)}</p>
<p className="text-sm text-muted-foreground">
{correctCount} out of {totalQuestions} questions correct
</p>
</div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-700 dark:text-green-300">
                Correct
              </span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {correctCount}
            </div>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-700 dark:text-red-300">
                Incorrect
              </span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {incorrectCount}
            </div>
          </div>
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="p-4 bg-muted rounded-lg border">
            <h3 className="font-semibold mb-2">💡 Improvement Tip</h3>
            <p className="text-sm text-muted-foreground">
              {result.improvementTip}
            </p>
          </div>
        )}

        {/* Question Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold">Question Breakdown</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {questions.map((q, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  q.isCorrect
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium flex-1">{q.question}</p>
                </div>
                <div className="ml-6 space-y-1 text-xs">
                  <p>
                    <span className="font-medium">Your answer:</span>{" "}
                    <span className="text-muted-foreground">
                      {q.userAnswer || "Not answered"}
                    </span>
                  </p>
                  {!q.isCorrect && (
                    <p>
                      <span className="font-medium">Correct answer:</span>{" "}
                      <span className="text-green-600 dark:text-green-400">
                        {q.answer}
                      </span>
                    </p>
                  )}
                  {q.explanation && (
                    <p className="text-muted-foreground italic mt-1">
                      {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onStartNew} className="w-full">
          Start New Quiz
        </Button>
      </CardFooter>
    </Card>
);
};

export default QuizResult;
