import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LeaderboardEntry = {
  user_id: number;
  name: string;
  quizzes_taken: number;
  total_score: number;
  total_questions: number;
  avg_score: number;
};

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setLeaders(data.leaderboard || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-10 text-center text-muted-foreground">
          Loading leaderboard...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {leaders.length === 0 ? (
              <p className="text-muted-foreground">
                No leaderboard data yet.
              </p>
            ) : (
              <div className="space-y-4">
                {leaders.map((u, i) => (
                  <div
                    key={u.user_id}
                    className="flex justify-between items-center border p-4 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">
                        #{i + 1} {u.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quizzes: {u.quizzes_taken}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{u.avg_score}%</p>
                      <p className="text-sm text-muted-foreground">
                        {u.total_score}/{u.total_questions}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
