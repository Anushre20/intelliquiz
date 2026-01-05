import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PlayCircle,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Zap,
  ChevronRight,
  Brain,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "@/utils/auth"; // ✅ ADD

type RecentQuiz = {
  topic: string;
  score: number;
  time_taken: number;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser(); // ✅ ADD

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    avgScore: 0,
    totalTime: 0,
  });
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);

  /* =======================
     AUTH GUARD
  ======================= */
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  /* =======================
     FETCH DASHBOARD DATA
  ======================= */
  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      try {
        // ✅ FIXED ENDPOINT
        const res = await fetch(
          `http://localhost:5001/api/dashboard/${user.id}`
        );
        const data = await res.json();

        setStats({
          totalQuizzes: data.quizzesTaken || 0,
          avgScore: Math.round(data.averageScore || 0),
          totalTime: data.timeStudied || 0,
        });

        setRecentQuizzes(data.recent || []);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard analytics error:", err);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <AppLayout>
        <div className="p-10 text-center text-muted-foreground">
          Loading dashboard...
        </div>
      </AppLayout>
    );
  }

  const statCards = [
    {
      label: "Quizzes Taken",
      value: stats.totalQuizzes,
      icon: Target,
      color: "text-primary",
    },
    {
      label: "Avg. Score",
      value: `${stats.avgScore}%`,
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Time Studied",
      value: `${Math.round(stats.totalTime / 60)} min`,
      icon: Clock,
      color: "text-accent",
    },
    {
      label: "Current Streak",
      value: "—",
      icon: Zap,
      color: "text-warning",
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">
              Welcome back 👋
            </h1>
            <p className="text-muted-foreground">
              Here’s your learning progress so far
            </p>
          </div>

          <Button variant="hero" size="lg" asChild>
            <Link to="/quiz-setup">
              <PlayCircle className="h-5 w-5" />
              Start New Quiz
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} variant="interactive">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-lg bg-primary/10 ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-display text-2xl font-bold">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Quizzes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Recent Quizzes
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentQuizzes.length === 0 && (
              <div className="text-muted-foreground text-sm">
                No quiz attempts yet.
              </div>
            )}

            {recentQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{quiz.topic}</h4>
                    <p className="text-sm text-muted-foreground">
                      Time: {quiz.time_taken}s
                    </p>
                  </div>
                </div>

                <span className="font-display text-xl font-bold text-primary">
                  {quiz.score}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Progress (UI only) */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.totalQuizzes * 10} className="h-3" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
