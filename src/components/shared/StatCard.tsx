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
  description,
  tooltip,
  onClick,
  className,
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "p-3 sm:p-4 border-border/50 transition-all",
        onClick && "cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
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
          <p className="text-base sm:text-xl font-bold text-foreground truncate">{value}</p>
          {subtitle && (
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
          {description && (
            <p className="text-[10px] sm:text-xs text-muted-foreground/80 truncate">{description}</p>
          )}
        </div>
        <div className={cn("p-1.5 sm:p-2 rounded-lg sm:rounded-xl shrink-0", colorStyles[color])}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </Card>
  );
}