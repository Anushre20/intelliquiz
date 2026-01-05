import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  BarChart3,
  Trophy,
  User,
  LogOut,
  Brain,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: PlayCircle, label: "Start Quiz", path: "/quiz-setup" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar transition-transform lg:translate-x-0">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">
              QuizMaster
            </h1>
            <p className="text-xs text-muted-foreground">AI-Powered Learning</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                John Doe
              </p>
              <p className="text-xs text-muted-foreground truncate">
                john@example.com
              </p>
            </div>
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-background hover:text-foreground transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
