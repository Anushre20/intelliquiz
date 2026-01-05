import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Play,
  Target,
  Zap,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const difficulties = [
  {
    id: "easy",
    name: "Easy",
    description: "Basic concepts and fundamentals",
    icon: BookOpen,
    color: "border-success text-success bg-success/5",
  },
  {
    id: "medium",
    name: "Medium",
    description: "Intermediate level questions",
    icon: Target,
    color: "border-accent text-accent bg-accent/5",
  },
  {
    id: "hard",
    name: "Hard",
    description: "Advanced and challenging",
    icon: Zap,
    color: "border-destructive text-destructive bg-destructive/5",
  },
];

export default function QuizSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [topicDescription, setTopicDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState([10]);
  const [loading, setLoading] = useState(false);

  /* =======================
     FILE HANDLERS
  ======================= */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* =======================
     START QUIZ (FINAL FIX ✅)
  ======================= */
  const handleStartQuiz = async () => {
    if (!selectedDifficulty) return;

    try {
      setLoading(true);

      /* 1️⃣ CREATE QUIZ */
      const quizRes = await fetch("http://localhost:5001/api/quiz/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topicDescription.slice(0, 500) || "AI Generated Quiz",
          difficulty: selectedDifficulty,
        }),
      });

      const quizData = await quizRes.json();
      if (!quizRes.ok || !quizData.quizId) {
        throw new Error("Failed to create quiz");
      }

      const quizId = quizData.quizId;

      /* 2️⃣ GENERATE AI QUESTIONS */
      const formData = new FormData();
      formData.append("quizId", quizId.toString());
      formData.append("difficulty", selectedDifficulty);
      formData.append("numberOfQuestions", questionCount[0].toString());

      if (uploadedFiles.length > 0) {
        formData.append("file", uploadedFiles[0]); // single PDF for now
      } else {
        formData.append("text", topicDescription);
      }

      const aiRes = await fetch("http://localhost:5001/api/ai/generate", {
        method: "POST",
        body: formData,
      });

      const aiData = await aiRes.json();
      if (!aiRes.ok) {
        throw new Error(aiData.message || "AI generation failed");
      }

      /* 3️⃣ NAVIGATE ONLY AFTER SUCCESS */
      navigate("/quiz", {
        state: { quizId },
      });
    } catch (err: any) {
      alert(err.message || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    (topicDescription.trim() || uploadedFiles.length > 0) &&
    selectedDifficulty;

  /* =======================
     UI
  ======================= */
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Create Your Quiz
          </h1>
          <p className="text-muted-foreground mt-2">
            AI-powered quiz generation from your content
          </p>
        </div>

        {/* TOPIC */}
        <Card>
          <CardHeader>
            <CardTitle>Define Your Topic</CardTitle>
            <CardDescription>
              Upload files or describe what you want to be quizzed on
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50"
            >
              <Upload className="mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Upload PDFs / text files (optional)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedFiles.map((file, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span className="text-sm truncate">{file.name}</span>
                <button onClick={() => removeFile(i)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            <Textarea
              placeholder="Describe the topic..."
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* DIFFICULTY */}
        <Card>
          <CardHeader>
            <CardTitle>Select Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            {difficulties.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={cn(
                  "p-4 rounded-xl border text-left",
                  selectedDifficulty === d.id
                    ? d.color
                    : "border-border hover:border-primary/30"
                )}
              >
                <d.icon className="mb-2" />
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm text-muted-foreground">{d.description}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* QUESTION COUNT */}
        <Card>
          <CardHeader>
            <CardTitle>Number of Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={questionCount}
              onValueChange={setQuestionCount}
              min={5}
              max={30}
              step={5}
            />
            <p className="text-center mt-2 text-lg font-bold">
              {questionCount[0]} questions
            </p>
          </CardContent>
        </Card>

        <Button
          variant="hero"
          size="xl"
          disabled={!isValid || loading}
          onClick={handleStartQuiz}
          className="w-full"
        >
          {loading ? "Generating Quiz..." : "Start Quiz"}
        </Button>
      </div>
    </AppLayout>
  );
}
