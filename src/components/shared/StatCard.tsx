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
    <Card className={cn("p-4 border-border/50", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2 rounded-xl", colorStyles[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}