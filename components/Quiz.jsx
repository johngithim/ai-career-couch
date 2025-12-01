"use client";

import React, { useEffect, useState } from "react";
import useFetch from "../hooks/use-fetch";
import { generateQuiz, saveQuizResult } from "../actions/interview";
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
import { BarLoader } from "react-spinners";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QuizResult from "./QuizResult";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  console.log(resultData);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  const calculateScore = () => {
    if (!quizData || quizData.length === 0) return 0;
    
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer && quizData[index] && answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quizData.length) * 100 * 10) / 10; // Round to 1 decimal place
  };

  const finishQuiz = async () => {
    const score = calculateScore();

    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setShowExplanation(false);
    setAnswers([]);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return <BarLoader className={"mt-4"} width={"100%"} color={"gray"} />;
  }

  if (resultData) {
    return (
      <div className={"mx-2"}>
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className={"mx-2 my-4"}>
        <CardHeader>
          <CardTitle>Ready To Test Your Knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button className={"w-full cursor-pointer"} onClick={generateQuizFn}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <Card className={"mx-2"}>
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className={"space-y-4"}>
        <p className={"text-lg font-medium"}>{question.question}</p>

        <RadioGroup
          className={"space-y-2"}
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
        >
          {question.options.map((option, index) => (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className={"mt-4 p-4 bg-muted rounded-lg"}>
            <p className={"font-medium"}>Explanation:</p>
            <p className={"text-muted-foreground"}>{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {!showExplanation && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant={"outline"}
              disabled={!answers[currentQuestion]}
            >
              Show Explanation
            </Button>
          )}
        </div>

        <div className="flex gap-2 ml-auto">
          <Button
            onClick={handleBack}
            variant={"outline"}
            disabled={currentQuestion === 0 || savingResult}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion] || savingResult}
          >
            {savingResult && <Loader2 className={"mr-2 h-4 w-4 animate-spin"} />}
            {currentQuestion < quizData.length - 1
              ? "Next Question"
              : "Finish Quiz"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
export default Quiz;
