import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/utils/auth";

type Attempt = {
  quiz_id: number;
  score: number;
  total: number;
  time_taken: number;
  created_at: string;
};

export default function Profile() {
  const navigate = useNavigate();
  const authUser = getUser();

  const [user, setUser] = useState<any>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     AUTH GUARD
  ======================= */
  useEffect(() => {
    if (!authUser) navigate("/auth");
  }, [authUser, navigate]);

  /* =======================
     FETCH PROFILE
  ======================= */
  useEffect(() => {
    if (!authUser) return;

    fetch(`http://localhost:5001/api/profile/${authUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setAttempts(data.attempts || []);
      })
      .finally(() => setLoading(false));
  }, [authUser]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-10 text-center text-muted-foreground">
          Loading profile...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* USER INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">Name: {user.name}</p>
            <p className="text-muted-foreground">Email: {user.email}</p>
          </CardContent>
        </Card>

        {/* QUIZ HISTORY */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz History</CardTitle>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <p className="text-muted-foreground">
                No quizzes attempted yet.
              </p>
            ) : (
              <div className="space-y-4">
                {attempts.map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border p-4 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Quiz #{a.quiz_id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(a.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {a.score}/{a.total}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {a.time_taken}s
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
