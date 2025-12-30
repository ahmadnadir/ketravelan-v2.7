import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  userName?: string;
  className?: string;
}

export function TypingIndicator({ userName, className }: TypingIndicatorProps) {
  return (
    <div className={cn("flex flex-col gap-0.5 sm:gap-1", className)}>
      {userName && (
        <span className="text-[10px] sm:text-xs text-muted-foreground ml-2 sm:ml-3">
          {userName}
        </span>
      )}
      <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-bl-sm px-4 py-3 w-fit">
        <div className="flex items-center gap-1">
          <span 
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "600ms" }}
          />
          <span 
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: "150ms", animationDuration: "600ms" }}
          />
          <span 
            className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"
            style={{ animationDelay: "300ms", animationDuration: "600ms" }}
          />
        </div>
      </div>
    </div>
  );
}
