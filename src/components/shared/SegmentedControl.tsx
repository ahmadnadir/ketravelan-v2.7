import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: { label: string; value: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div className={cn("flex p-1 bg-secondary rounded-xl", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all",
            value === option.value
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className={cn(
              "ml-1.5",
              value === option.value ? "text-primary" : "text-muted-foreground"
            )}>
              ({option.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}