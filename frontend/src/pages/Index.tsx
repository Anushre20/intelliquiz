import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Zap, 
  BarChart3, 
  Trophy, 
  Users, 
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description: "Intelligent question generation tailored to your learning level and goals",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track your progress with detailed insights and visualizations",
  },
  {
    icon: Target,
    title: "Adaptive Difficulty",
    description: "Questions that adapt to challenge you at just the right level",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    description: "Compete with peers and climb the ranks to become a champion",
  },
];

const stats = [
  { value: "10K+", label: "Active Learners" },
  { value: "500K+", label: "Quizzes Completed" },
  { value: "50+", label: "Topics Available" },
  { value: "95%", label: "User Satisfaction" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">QuizMaster</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning Platform
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Master Any Subject with{" "}
            <span className="text-gradient-primary">Intelligent Quizzes</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate personalized quizzes, track your progress, and compete with learners worldwide. 
            Our AI adapts to your learning style for maximum retention.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth">
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/dashboard">
                View Demo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-8 border-t border-border">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 lg:py-24 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Everything You Need to Learn Smarter
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Powerful features designed to accelerate your learning journey
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="interactive"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-16 lg:py-24 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-4">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Choose Your Topic", description: "Select from 50+ subjects and set your difficulty level" },
              { step: "2", title: "Take the Quiz", description: "Answer AI-generated questions with real-time feedback" },
              { step: "3", title: "Track & Improve", description: "Review analytics and get personalized recommendations" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground font-display text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 lg:py-24">
        <Card className="bg-gradient-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-8 lg:p-12 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of learners who have already improved their knowledge with QuizMaster
            </p>
            <Button 
              size="xl" 
              className="bg-card text-foreground hover:bg-card/90"
              asChild
            >
              <Link to="/auth">
                Get Started for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-display font-semibold text-foreground">QuizMaster</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 QuizMaster. Built with AI for smarter learning.
          </p>
        </div>
      </footer>
    </div>
  );
}
