import { useState } from 'react';
import { MapPin, Plus, X, GripVertical, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RouteBuilderProps {
  stops: string[];
  onChange: (stops: string[]) => void;
  primaryDestination: string;
}

// Mock destinations for quick add
const popularStops = [
  'Thailand',
  'Vietnam', 
  'Laos',
  'Cambodia',
  'Singapore',
  'Bali',
];

export function RouteBuilder({ stops, onChange, primaryDestination }: RouteBuilderProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newStop, setNewStop] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      moveStop(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const addStop = (stop: string) => {
    if (stop.trim() && !stops.includes(stop.trim())) {
      onChange([...stops, stop.trim()]);
    }
    setNewStop('');
    setIsAdding(false);
    setShowSuggestions(false);
  };

  const removeStop = (index: number) => {
    onChange(stops.filter((_, i) => i !== index));
  };

  const moveStop = (from: number, to: number) => {
    if (to < 0 || to >= stops.length) return;
    const newStops = [...stops];
    const [removed] = newStops.splice(from, 1);
    newStops.splice(to, 0, removed);
    onChange(newStops);
  };

  const filteredSuggestions = popularStops.filter(
    s => 
      !stops.includes(s) && 
      s !== primaryDestination &&
      s.toLowerCase().includes(newStop.toLowerCase())
  );

  if (stops.length === 0 && !isAdding) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsAdding(true)}
        className="w-full justify-start gap-2 rounded-xl border-dashed text-muted-foreground"
      >
        <Plus className="h-4 w-4" />
        Add stop
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Route visualization */}
      {(stops.length > 0 || primaryDestination) && (
        <div className="flex items-center gap-2 flex-wrap text-sm">
          {primaryDestination && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-full font-medium">
              <MapPin className="h-3.5 w-3.5" />
              {primaryDestination}
            </span>
          )}
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-foreground rounded-full">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {stop}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Stop list for editing */}
      {stops.length > 0 && (
        <div className="space-y-2">
          {stops.map((stop, index) => (
            <div
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-2 p-2 bg-secondary/50 rounded-xl group cursor-grab active:cursor-grabbing",
                draggedIndex === index && "opacity-50"
              )}
            >
              <div className="p-1 touch-none opacity-50 group-hover:opacity-100">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm font-medium text-black">{stop}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveStop(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 hover:bg-secondary rounded disabled:opacity-30"
                >
                  <span className="text-xs">↑</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveStop(index, index + 1)}
                  disabled={index === stops.length - 1}
                  className="p-1 hover:bg-secondary rounded disabled:opacity-30"
                >
                  <span className="text-xs">↓</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeStop(index)}
                className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new stop */}
      {isAdding ? (
        <div className="relative">
          <Input
            value={newStop}
            onChange={(e) => {
              setNewStop(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addStop(newStop);
              } else if (e.key === 'Escape') {
                setIsAdding(false);
                setNewStop('');
              }
            }}
            placeholder="Add a stop..."
            className="rounded-xl"
            autoFocus
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addStop(suggestion)}
                  className={cn(
                    "w-full px-4 py-2.5 flex items-center gap-2 hover:bg-accent transition-colors text-left text-sm"
                  )}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              size="sm"
              onClick={() => addStop(newStop)}
              disabled={!newStop.trim()}
              className="rounded-lg"
            >
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewStop('');
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-2 rounded-xl border-dashed"
        >
          <Plus className="h-4 w-4" />
          Add another stop
        </Button>
      )}

      <p className="text-xs text-muted-foreground">
        For cross-border or multi-city trips. You can refine later.
      </p>
    </div>
  );
}
