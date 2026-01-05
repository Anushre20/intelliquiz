import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getUser } from "@/utils/auth";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuizPlayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { quizId?: number };

  const user = getUser();
  const submittedRef = useRef(false); // 🔒 prevent double submit

  /* =======================
     STATE
  ======================= */
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 min

  /* =======================
     AUTH + QUIZ GUARD
  ======================= */
  const [guardChecked, setGuardChecked] = useState(false);

useEffect(() => {
  // Wait one tick to allow router state to hydrate
  if (user === undefined) return;

  if (!user) {
    navigate("/auth");
    return;
  }

  if (!state?.quizId) {
    navigate("/dashboard");
    return;
  }

  setGuardChecked(true);
}, [state, user, navigate]);

  /* =======================
     FETCH QUESTIONS
  ======================= */
  useEffect(() => {
    if (!state?.quizId) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/quiz/${state.quizId}/questions`
        );
        const data = await res.json();

        if (!data.questions || !data.questions.length) {
          navigate("/dashboard");
          return;
        }

        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [state?.quizId, navigate]);

  /* =======================
     TIMER (SAFE)
  ======================= */
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  /* =======================
     HELPERS
  ======================= */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (index: number) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = index;
      return copy;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    }
  };

  /* =======================
     SUBMIT QUIZ (BULLETPROOF ✅)
  ======================= */
  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    try {
      let score = 0;
      answers.forEach((ans, i) => {
        if (ans === questions[i]?.correct) score++;
      });

      const res = await fetch(
        `http://localhost:5001/api/quiz/${state!.quizId}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user!.id,
            score,
            timeTaken: 600 - timeLeft,
          }),
        }
      );

      const data = await res.json();

      navigate("/results", {
        state: {
          score: data.score,
          total: questions.length,
          questions,
          answers,
          timeTaken: 600 - timeLeft,
        },
      });
    } catch (err) {
      console.error("Quiz submission failed:", err);
      alert("Failed to submit quiz");
      submittedRef.current = false;
    }
  };

  /* =======================
     GUARDS
  ======================= */
  if (loading || !guardChecked) {
  return (
    <div className="p-10 text-center text-muted-foreground">
      Loading quiz...
    </div>
  );
}


  /* =======================
     DERIVED
  ======================= */
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = answers.filter((a) => a !== null).length;
  const question = questions[currentQuestion];
  const isTimeLow = timeLeft < 60;

  /* =======================
     UI
  ======================= */
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <span className="font-bold text-lg">QuizMaster</span>
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-mono",
              isTimeLow ? "bg-destructive/10 text-destructive" : "bg-muted"
            )}
          >
            <Clock className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <div className="flex justify-between text-sm">
              <span>
                Question {currentQuestion + 1} / {questions.length}
              </span>
              <span>{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {question.question}
              </h2>

              <div className="grid gap-3">
                {question.options.map((opt: string, i: number) => {
                  const selected = answers[currentQuestion] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={cn(
                        "p-4 rounded-xl border flex gap-4 items-center",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      {selected && <CheckCircle2 className="h-5 w-5" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button onClick={handlePrev} disabled={currentQuestion === 0}>
              <ChevronLeft /> Previous
            </Button>

            {currentQuestion === questions.length - 1 ? (
              <Button variant="hero" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next <ChevronRight />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
