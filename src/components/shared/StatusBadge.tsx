import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = "settled" | "pending";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  size?: "sm" | "md";
}

const statusStyles: Record<StatusType, string> = {
  settled: "bg-stat-green/10 text-stat-green border-stat-green/30",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

const sizeStyles = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function StatusBadge({ status, className, size = "sm" }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        statusStyles[status],
        sizeStyles[size],
        className
      )}
    >
      {status === "settled" ? "Settled" : "Pending"}
    </Badge>
  );
}
