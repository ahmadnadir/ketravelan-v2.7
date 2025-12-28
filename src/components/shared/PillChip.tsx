import { cn } from "@/lib/utils";

interface PillChipProps {
  label: string;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  size?: "sm" | "md";
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const variantStyles = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

export function PillChip({
  label,
  variant = "default",
  size = "md",
  onClick,
  selected,
  className,
}: PillChipProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        onClick && "cursor-pointer hover:opacity-80",
        selected ? "bg-primary text-primary-foreground" : variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}