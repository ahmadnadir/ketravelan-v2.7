import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red";
  subtitle?: string;
  className?: string;
}

const colorStyles = {
  blue: "bg-stat-blue/10 text-stat-blue",
  green: "bg-stat-green/10 text-stat-green",
  orange: "bg-stat-orange/10 text-stat-orange",
  red: "bg-stat-red/10 text-stat-red",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-3 sm:p-4 border-border/50", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
          <p className="text-base sm:text-xl font-bold text-foreground truncate">{value}</p>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0", colorStyles[color])}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </Card>
  );
}
