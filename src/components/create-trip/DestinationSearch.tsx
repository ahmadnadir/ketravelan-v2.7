import { useState, useRef, useEffect } from 'react';
import { MapPin, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DestinationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
}

// Mock destinations for autocomplete
const mockDestinations = [
  { name: 'Kyoto, Japan', region: 'Kansai Region' },
  { name: 'Vietnam', region: 'Southeast Asia' },
  { name: 'Dolomites, Italy', region: 'Northern Italy' },
  { name: 'Thailand', region: 'Southeast Asia' },
  { name: 'Bali, Indonesia', region: 'Indonesia' },
  { name: 'Langkawi, Malaysia', region: 'Kedah' },
  { name: 'Cameron Highlands, Malaysia', region: 'Pahang' },
  { name: 'Kuala Lumpur, Malaysia', region: 'Federal Territory' },
  { name: 'Singapore', region: 'Southeast Asia' },
  { name: 'Seoul, South Korea', region: 'South Korea' },
  { name: 'Tokyo, Japan', region: 'Kanto Region' },
  { name: 'Laos', region: 'Southeast Asia' },
  { name: 'Maldives', region: 'Indian Ocean' },
  { name: 'Phuket, Thailand', region: 'Southern Thailand' },
  { name: 'Penang, Malaysia', region: 'Penang' },
];

export function DestinationSearch({
  value,
  onChange,
  placeholder = 'Search city, country, or region',
  helperText,
}: DestinationSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState(mockDestinations);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockDestinations.filter(
        d =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.region.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDestinations(filtered);
    } else {
      setFilteredDestinations(mockDestinations);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (destination: string) => {
    onChange(destination);
    setQuery('');
    setIsOpen(false);
  };

  const handleRemove = () => {
    onChange('');
  };

  if (value) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium text-foreground flex-1">{value}</span>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="rounded-xl pl-10 text-sm"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden max-h-[240px] overflow-y-auto">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest) => (
              <button
                key={dest.name}
                type="button"
                onClick={() => handleSelect(dest.name)}
                className={cn(
                  "w-full px-4 py-3 flex items-start gap-3 hover:bg-accent transition-colors text-left"
                )}
              >
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{dest.name}</p>
                  <p className="text-xs text-muted-foreground">{dest.region}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No destinations found</p>
              <button
                type="button"
                onClick={() => handleSelect(query)}
                className="mt-2 text-sm text-primary font-medium"
              >
                Use "{query}" anyway
              </button>
            </div>
          )}
        </div>
      )}

      {helperText && !isOpen && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
