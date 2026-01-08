import { useState, useMemo } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RequirementsSectionProps {
  expectations: string[];
  onChange: (expectations: string[]) => void;
}

const expectationCategories = [
  {
    id: 'budget',
    label: 'Budget & Spending',
    emoji: '💸',
    priority: true,
    options: [
      { label: 'Budget-focused trip', emoji: '💰' },
      { label: 'Shared expenses throughout', emoji: '🤝' },
      { label: 'Pay upfront for some bookings', emoji: '💳' },
      { label: 'Reimbursements via expense tracking', emoji: '📊' },
      { label: 'Eat local, not fancy', emoji: '🍜' },
    ],
  },
  {
    id: 'pace',
    label: 'Trip Style & Pace',
    emoji: '🧭',
    priority: true,
    options: [
      { label: 'Moderate walking involved', emoji: '🚶' },
      { label: 'Physically active days', emoji: '💪' },
      { label: 'Early starts on some days', emoji: '🌅' },
      { label: 'Flexible itinerary', emoji: '🔀' },
      { label: 'Weather-dependent activities', emoji: '🌦️' },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics & Responsibility',
    emoji: '🛂',
    priority: true,
    options: [
      { label: 'Passport required', emoji: '🛂' },
      { label: 'Visa may be required', emoji: '📋' },
      { label: 'Travel insurance recommended', emoji: '🛡️' },
      { label: 'Self-responsible for documents', emoji: '📄' },
      { label: 'Flights booked individually', emoji: '✈️' },
    ],
  },
  {
    id: 'stay',
    label: 'Stay & Comfort',
    emoji: '🏠',
    options: [
      { label: 'Shared accommodation', emoji: '🏠' },
      { label: 'Budget stays', emoji: '🛏️' },
      { label: 'Basic amenities', emoji: '🚿' },
      { label: 'Limited luggage space', emoji: '🎒' },
    ],
  },
  {
    id: 'group',
    label: 'Group Dynamics',
    emoji: '🤝',
    options: [
      { label: 'Small group travel', emoji: '👥' },
      { label: 'Open to meeting new people', emoji: '🙋' },
      { label: 'Group decisions & voting', emoji: '🗳️' },
      { label: 'Respect personal space', emoji: '🧘' },
      { label: 'Chill / non-party vibes', emoji: '😌' },
    ],
  },
  {
    id: 'preferences',
    label: 'Preferences',
    emoji: '🌱',
    optional: true,
    options: [
      { label: 'Vegetarian-friendly', emoji: '🥗' },
      { label: 'Alcohol-optional', emoji: '🍵' },
      { label: 'Photography-friendly', emoji: '📸' },
      { label: 'Culture-focused', emoji: '🏛️' },
      { label: 'Nature-heavy itinerary', emoji: '🌿' },
    ],
  },
];

// Get all predefined labels for checking custom expectations
const allPredefinedLabels = expectationCategories.flatMap(cat => 
  cat.options.map(opt => opt.label)
);

export function RequirementsSection({
  expectations,
  onChange,
}: RequirementsSectionProps) {
  const [customInput, setCustomInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Get default visible options (first 2-3 from priority categories)
  const defaultVisibleOptions = useMemo(() => {
    const priorityCategories = expectationCategories.filter(cat => cat.priority);
    const options: { label: string; emoji: string }[] = [];
    
    for (const cat of priorityCategories) {
      options.push(...cat.options.slice(0, 2));
    }
    
    return options.slice(0, 8);
  }, []);

  const toggleExpectation = (exp: string) => {
    if (expectations.includes(exp)) {
      onChange(expectations.filter(e => e !== exp));
    } else if (expectations.length < 12) {
      onChange([...expectations, exp]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !expectations.includes(trimmed) && expectations.length < 12) {
      onChange([...expectations, trimmed]);
      setCustomInput('');
    }
  };

  const customExpectations = expectations.filter(
    e => !allPredefinedLabels.includes(e)
  );

  // Get selected items that aren't in default view (for collapsed state)
  const selectedNotInDefault = expectations.filter(exp => 
    !defaultVisibleOptions.some(opt => opt.label === exp) && 
    allPredefinedLabels.includes(exp)
  );

  const renderChip = (option: { label: string; emoji: string }) => {
    const isSelected = expectations.includes(option.label);
    return (
      <button
        key={option.label}
        type="button"
        onClick={() => toggleExpectation(option.label)}
        className={cn(
          "px-3 py-1.5 text-sm rounded-full border transition-all active:scale-95",
          isSelected
            ? "bg-foreground text-background border-foreground font-medium"
            : "bg-white border-border text-muted-foreground hover:bg-foreground hover:text-background"
        )}
      >
        {option.emoji} {option.label}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          What to Expect
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Set clear expectations so everyone joins with the same understanding.
        </p>
      </div>

      {/* Collapsed View */}
      {!isExpanded && (
        <>
          <div className="flex flex-wrap gap-2">
            {defaultVisibleOptions.map(renderChip)}
            {/* Show selected items not in default view */}
            {selectedNotInDefault.map(label => {
              const option = expectationCategories
                .flatMap(cat => cat.options)
                .find(opt => opt.label === label);
              if (option) return renderChip(option);
              return null;
            })}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className="h-4 w-4" />
            Show more options
          </button>
        </>
      )}

      {/* Expanded View - Grouped by Category */}
      {isExpanded && (
        <div className="space-y-4">
          {expectationCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <span className="text-xs text-muted-foreground font-medium">
                {category.emoji} {category.label}
                {category.optional && <span className="ml-1 opacity-60">(optional)</span>}
              </span>
              <div className="flex flex-wrap gap-2">
                {category.options.map(renderChip)}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronUp className="h-4 w-4" />
            Show less
          </button>
        </div>
      )}

      {/* Custom expectations */}
      {customExpectations.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
          {customExpectations.map((exp) => (
            <div
              key={exp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background border border-foreground text-sm rounded-full font-medium"
            >
              <span>📦 {exp}</span>
              <button
                type="button"
                onClick={() => toggleExpectation(exp)}
                className="p-0.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add custom */}
      {expectations.length < 12 && (
        <div className="flex gap-2">
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add custom requirement"
            className="rounded-xl flex-1"
            maxLength={30}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customInput.trim() || expectations.length >= 12}
            className="p-2.5 bg-secondary rounded-xl hover:bg-secondary/80 disabled:opacity-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {expectations.length}/12 selected • Max 30 characters per item
      </p>
    </div>
  );
}
