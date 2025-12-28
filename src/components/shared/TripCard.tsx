import { Calendar, MapPin, Users, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PillChip } from "./PillChip";
import { cn } from "@/lib/utils";

interface TripCardProps {
  id: string;
  title: string;
  destination: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  price: number;
  currency?: string;
  slotsLeft: number;
  totalSlots: number;
  tags: string[];
  isAlmostFull?: boolean;
  className?: string;
}

export function TripCard({
  id,
  title,
  destination,
  imageUrl,
  startDate,
  endDate,
  price,
  currency = "RM",
  slotsLeft,
  totalSlots,
  tags,
  isAlmostFull,
  className,
}: TripCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm", className)}>
      <Link to={`/trip/${id}`}>
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          {isAlmostFull && (
            <div className="absolute top-3 left-3">
              <span className="bg-warning text-warning-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                Almost Full
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                // Share logic
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                // Save logic
              }}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link to={`/trip/${id}`}>
          <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <MapPin className="h-4 w-4" />
          <span>{destination}</span>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Calendar className="h-4 w-4" />
          <span>{startDate} - {endDate}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <PillChip key={tag} label={tag} size="sm" />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{slotsLeft} slots left</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-foreground">
              {currency} {price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/pax</span>
          </div>
        </div>
      </div>
    </Card>
  );
}