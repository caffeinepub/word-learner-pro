import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, CheckSquare, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const TOOLS = [
  {
    icon: Brain,
    title: "Quick Practice",
    description:
      "Rapidly quiz yourself on random words from your vocabulary list.",
    cta: "Start Practice",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: CheckSquare,
    title: "Quizzes",
    description:
      "Multiple-choice and fill-in-the-blank quizzes to test retention.",
    cta: "Take a Quiz",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: RotateCcw,
    title: "Review",
    description:
      "Spaced repetition review of words you haven't practiced recently.",
    cta: "Start Review",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
];

export function LearningTools() {
  return (
    <div>
      <h2 className="text-lg font-bold text-foreground mb-4">Learning Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TOOLS.map((tool) => (
          <Card
            key={tool.title}
            className="shadow-card hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <div
                className={`w-10 h-10 rounded-xl ${tool.bg} flex items-center justify-center mb-2`}
              >
                <tool.icon size={20} className={tool.color} />
              </div>
              <CardTitle className="text-base">{tool.title}</CardTitle>
              <CardDescription className="text-sm">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                data-ocid={`tools.${tool.title.toLowerCase().replace(/\s+/g, "_")}.primary_button`}
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => toast.info(`${tool.title} coming soon!`)}
              >
                {tool.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
