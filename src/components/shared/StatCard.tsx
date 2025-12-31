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
      <div className="space-y-0.5 sm:space-y-1">
        <div className="flex items-center gap-1">
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