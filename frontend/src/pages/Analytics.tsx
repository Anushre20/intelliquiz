import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { getUser } from "@/utils/auth";

export default function Analytics() {
  const user = getUser();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5001/api/analytics/${user.id}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [user]);

  if (!data) {
    return (
      <AppLayout>
        <div className="p-10 text-center text-muted-foreground">
          Loading analytics...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Quizzes Attempted" value={data.totalAttempts} />
        <Stat title="Accuracy" value={`${data.accuracy}%`} />
        <Stat title="Questions Answered" value={data.totalQuestions} />
        <Stat title="Time Spent (seconds)" value={data.totalTime} />
      </div>
    </AppLayout>
  );
}

function Stat({ title, value }: { title: string; value: any }) {
  return (
    <div className="p-6 rounded-xl border bg-card">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
