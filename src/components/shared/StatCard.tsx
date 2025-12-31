import { LucideIcon, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red";
  subtitle?: string;
  description?: string;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "highlight" | "summary";
  showIcon?: boolean;
}

const iconColors = {
  blue: "text-stat-blue",
  green: "text-stat-green",
  orange: "text-stat-orange",
  red: "text-stat-red",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  description,
  tooltip,
  onClick,
  className,
  variant = "default",
  showIcon = true,
}: StatCardProps) {
  // Summary variant: centered, no icon, larger text
  if (variant === "summary") {
    return (
      <Card 
        className={cn(
          "p-4 sm:p-5 border-border/50 transition-all",
          onClick && "cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98]",
          className
        )}
        onClick={onClick}
      >
        <div className="text-center space-y-1">
          <p className="text-[13px] sm:text-xs text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-[12px] sm:text-[11px] text-muted-foreground/80">{description}</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "p-3 sm:p-4 border-border/50 transition-all",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-0.5 sm:space-y-1">
        <div className="flex items-center gap-1.5">
          {showIcon && (
            <Icon className={cn("h-4 w-4 shrink-0", iconColors[color])} />
          )}
          <p className="text-[13px] sm:text-xs md:text-sm text-muted-foreground">{title}</p>
          {tooltip && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Info className="h-3 w-3 text-muted-foreground/60 shrink-0 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-lg sm:text-base md:text-xl font-bold text-foreground">{value}</p>
        {subtitle && (
          <p className="text-[12px] sm:text-[10px] md:text-xs text-muted-foreground">{subtitle}</p>
        )}
        {description && (
          <p className="text-[12px] sm:text-[10px] md:text-xs text-muted-foreground/80">{description}</p>
        )}
      </div>
    </Card>
  );
}