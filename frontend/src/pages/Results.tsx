import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as {
    score: number;
    total: number;
    timeTaken: number;
  };

  // 🔐 Guard
  if (!state) {
    return (
      <AppLayout>
        <div className="p-10 text-center text-muted-foreground">
          No result data found.
        </div>
      </AppLayout>
    );
  }

  const percentage = Math.round((state.score / state.total) * 100);

  return (
    <AppLayout>
      <Card className="max-w-xl mx-auto mt-10">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-3xl font-bold">Quiz Completed 🎉</h1>

          <p className="text-xl font-semibold">
            Score: {state.score} / {state.total}
          </p>

          <p className="text-lg">Percentage: {percentage}%</p>

          <p className="text-muted-foreground">
            Time Taken: {state.timeTaken}s
          </p>

          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
