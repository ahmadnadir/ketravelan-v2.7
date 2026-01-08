import { cn } from "@/lib/utils";

export interface TravelStyle {
  id: string;
  label: string;
  emoji: string;
}

export const travelStyles: TravelStyle[] = [
  { id: "adventure", label: "Adventure", emoji: "🏔️" },
  { id: "budget", label: "Budget-friendly", emoji: "💰" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "food", label: "Food & Culinary", emoji: "🍜" },
  { id: "city", label: "City & Urban", emoji: "🏙️" },
  { id: "culture", label: "Culture", emoji: "🏛️" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "hiking", label: "Hiking", emoji: "🥾" },
  { id: "wildlife", label: "Wildlife", emoji: "🦁" },
  { id: "beach", label: "Beach", emoji: "🏖️" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "backpacking", label: "Backpacking", emoji: "🎒" },
  { id: "solo", label: "Solo Travel", emoji: "🧭" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { id: "romantic", label: "Romantic", emoji: "💕" },
];

interface TravelStyleGridProps {
  selectedStyles: string[];
  onToggle: (styleId: string) => void;
}

export function TravelStyleGrid({ selectedStyles, onToggle }: TravelStyleGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {travelStyles.map((style) => {
        const isSelected = selectedStyles.includes(style.id);
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onToggle(style.id)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200",
              "hover:scale-[1.03] active:scale-[0.97]",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            <span className="text-2xl mb-1">{style.emoji}</span>
            <span
              className={cn(
                "text-xs font-medium text-center leading-tight",
                isSelected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {style.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
