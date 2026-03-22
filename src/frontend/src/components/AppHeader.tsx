import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ChevronDown, MessageSquare } from "lucide-react";

interface AppHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "vocabulary", label: "My Vocabulary" },
  { id: "sentences", label: "Sentences", icon: MessageSquare },
  { id: "tools", label: "Tools" },
  { id: "progress", label: "Progress" },
];

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs">
      <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg text-primary-foreground"
            style={{ background: "oklch(0.65 0.12 195)" }}
          >
            W
          </div>
          <span className="font-bold text-[15px] text-foreground whitespace-nowrap">
            Word Learner Pro
          </span>
        </div>

        {/* Nav */}
        <nav
          className="flex items-center gap-1 flex-1 ml-4"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.icon && <item.icon size={13} />}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                AL
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              Alex L.
            </span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
