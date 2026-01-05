import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuizPreview() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    quizId: number;
    questions: any[];
    difficulty: string;
  };

  if (!state || !state.questions?.length) {
    navigate("/dashboard");
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Preview</CardTitle>
            <p className="text-muted-foreground">
              Difficulty: <b>{state.difficulty}</b> • Questions:{" "}
              <b>{state.questions.length}</b>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.questions.map((q, i) => (
              <div key={i} className="border rounded-lg p-4">
                <p className="font-medium">
                  {i + 1}. {q.question}
                </p>
                <ul className="mt-2 text-sm text-muted-foreground">
                  <li>A. {q.option_a}</li>
                  <li>B. {q.option_b}</li>
                  <li>C. {q.option_c}</li>
                  <li>D. {q.option_d}</li>
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>

          <Button
            variant="hero"
            onClick={() =>
              navigate("/quiz", {
                state: { quizId: state.quizId },
              })
            }
          >
            Start Quiz
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
