import { useState } from 'react';
import { Ban, Calculator, TableProperties, Plus, X, Info } from 'lucide-react';
import { OptionCard } from './OptionCard';
import { Input } from '@/components/ui/input';
import { PillChip } from '@/components/shared/PillChip';
import { Badge } from '@/components/ui/badge';
import { CurrencyCode, getCurrencySymbol, travelCurrencies as allTravelCurrencies } from '@/lib/currencyUtils';
import { useAuth } from '@/contexts/AuthContext';
import { TravelCurrencyPicker } from './TravelCurrencyPicker';

interface BudgetSectionProps {
  budgetType: 'skip' | 'rough' | 'detailed';
  onBudgetTypeChange: (type: 'skip' | 'rough' | 'detailed') => void;
  roughBudgetTotal: number;
  onRoughBudgetTotalChange: (value: number) => void;
  roughBudgetCategories: string[];
  onRoughBudgetCategoriesChange: (categories: string[]) => void;
  detailedBudget: Record<string, number>;
  onDetailedBudgetChange: (budget: Record<string, number>) => void;
  travelCurrencies: CurrencyCode[];
  onTravelCurrenciesChange: (currencies: CurrencyCode[]) => void;
}

const defaultCategories = [
  { id: 'Flight', label: 'Flight', emoji: '✈️' },
  { id: 'Stay', label: 'Stay', emoji: '🏨' },
  { id: 'Food', label: 'Food', emoji: '🍴' },
  { id: 'Transport', label: 'Transport', emoji: '🚗' },
  { id: 'Activities', label: 'Activities', emoji: '🎫' },
  { id: 'Other', label: 'Other', emoji: '📦' },
];

export function BudgetSection({
  budgetType,
  onBudgetTypeChange,
  roughBudgetTotal,
  onRoughBudgetTotalChange,
  roughBudgetCategories,
  onRoughBudgetCategoriesChange,
  detailedBudget,
  onDetailedBudgetChange,
  travelCurrencies,
  onTravelCurrenciesChange,
}: BudgetSectionProps) {
  const { user } = useAuth();
  const homeCurrency: CurrencyCode = user?.homeCurrency || "MYR";
  const currencySymbol = getCurrencySymbol(homeCurrency);
  const [customCategory, setCustomCategory] = useState('');
  const [detailedCustomCategory, setDetailedCustomCategory] = useState('');

  const toggleCategory = (category: string) => {
    if (roughBudgetCategories.includes(category)) {
      onRoughBudgetCategoriesChange(roughBudgetCategories.filter(c => c !== category));
    } else {
      onRoughBudgetCategoriesChange([...roughBudgetCategories, category]);
    }
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !roughBudgetCategories.includes(customCategory.trim())) {
      onRoughBudgetCategoriesChange([...roughBudgetCategories, customCategory.trim()]);
      setCustomCategory('');
    }
  };

  const updateDetailedBudget = (category: string, value: number) => {
    onDetailedBudgetChange({ ...detailedBudget, [category]: value });
  };

  const addDetailedCustomCategory = () => {
    if (detailedCustomCategory.trim() && !detailedBudget.hasOwnProperty(detailedCustomCategory.trim())) {
      updateDetailedBudget(detailedCustomCategory.trim(), 0);
      setDetailedCustomCategory('');
    }
  };

  const removeDetailedCategory = (category: string) => {
    const newBudget = { ...detailedBudget };
    delete newBudget[category];
    onDetailedBudgetChange(newBudget);
  };

  return (
    <div className="space-y-3">
      <OptionCard
        icon={<Ban className="h-5 w-5" />}
        title="Skip for now"
        description="Decide budget later with your group"
        selected={budgetType === 'skip'}
        onClick={() => onBudgetTypeChange('skip')}
      />

      <OptionCard
        icon={<Calculator className="h-5 w-5" />}
        title="Rough budget"
        description="Set a total estimate and main categories"
        selected={budgetType === 'rough'}
        onClick={() => onBudgetTypeChange('rough')}
        
      >
        <div className="space-y-4">
          {/* Home currency indicator */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              Home currency: {currencySymbol} {homeCurrency}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Budget (per person)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                {currencySymbol}
              </span>
              <Input
                type="number"
                value={roughBudgetTotal || ''}
                onChange={(e) => onRoughBudgetTotalChange(Number(e.target.value))}
                placeholder="e.g., 2000"
                className="rounded-xl pl-10"
              />
            </div>
            <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <Info className="h-3 w-3 mt-0.5 shrink-0" />
              Budget is set in your home currency.
              {travelCurrencies.length > 0 
                ? ` Expenses can be added in: ${travelCurrencies.map(c => allTravelCurrencies.find(tc => tc.code === c)?.code).join(', ')}.`
                : ' Select travel currencies below for expense entry.'}
            </p>
          </div>
          
          {/* Travel Currency Picker */}
          <TravelCurrencyPicker
            selectedCurrencies={travelCurrencies}
            onSelectionChange={onTravelCurrenciesChange}
          />

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              What's included?
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultCategories.map((cat) => (
                <PillChip
                  key={cat.id}
                  label={cat.label}
                  icon={cat.emoji}
                  selected={roughBudgetCategories.includes(cat.id)}
                  onClick={() => toggleCategory(cat.id)}
                />
              ))}
              {roughBudgetCategories
                .filter(c => !defaultCategories.some(dc => dc.id === c))
                .map((cat) => (
                  <div key={cat} className="flex items-center gap-1">
                    <PillChip
                      label={cat}
                      selected={true}
                      onClick={() => toggleCategory(cat)}
                    />
                  </div>
                ))}
            </div>
            
            {roughBudgetCategories.length < 8 && (
              <div className="flex gap-2 mt-2">
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Custom category"
                  className="rounded-xl flex-1"
                  maxLength={20}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomCategory}
                  disabled={!customCategory.trim()}
                  className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </OptionCard>

      <OptionCard
        icon={<TableProperties className="h-5 w-5" />}
        title="Detailed budget"
        description="Category-by-category breakdown"
        selected={budgetType === 'detailed'}
        onClick={() => onBudgetTypeChange('detailed')}
      >
        <div className="space-y-3">
          {/* Home currency indicator */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs font-normal">
              Home currency: {currencySymbol} {homeCurrency}
            </Badge>
          </div>
          
          {defaultCategories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3">
              <span className="text-sm text-foreground w-24">{cat.emoji} {cat.label}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  {currencySymbol}
                </span>
                <Input
                  type="number"
                  value={detailedBudget[cat.id] || ''}
                  onChange={(e) => updateDetailedBudget(cat.id, Number(e.target.value))}
                  placeholder="0"
                  className="rounded-xl pl-10"
                />
              </div>
            </div>
          ))}
          
          {/* Custom categories */}
          {Object.keys(detailedBudget)
            .filter(cat => !defaultCategories.some(dc => dc.id === cat))
            .map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-24">📦 {cat}</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {currencySymbol}
                  </span>
                  <Input
                    type="number"
                    value={detailedBudget[cat] || ''}
                    onChange={(e) => updateDetailedBudget(cat, Number(e.target.value))}
                    placeholder="0"
                    className="rounded-xl pl-10"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDetailedCategory(cat)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          
          {/* Add custom category input */}
          {Object.keys(detailedBudget).length < 10 && (
            <div className="flex gap-2 mt-2">
              <Input
                value={detailedCustomCategory}
                onChange={(e) => setDetailedCustomCategory(e.target.value)}
                placeholder="Add custom category"
                className="rounded-xl flex-1"
                maxLength={20}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addDetailedCustomCategory();
                  }
                }}
              />
              <button
                type="button"
                onClick={addDetailedCustomCategory}
                disabled={!detailedCustomCategory.trim()}
                className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <p className="text-[11px] text-muted-foreground flex items-start gap-1.5 pt-2">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            Budget is set in your home currency.
            {travelCurrencies.length > 0 
              ? ` Expenses can be added in: ${travelCurrencies.map(c => allTravelCurrencies.find(tc => tc.code === c)?.code).join(', ')}.`
              : ' Select travel currencies below for expense entry.'}
          </p>
          
          {/* Travel Currency Picker */}
          <TravelCurrencyPicker
            selectedCurrencies={travelCurrencies}
            onSelectionChange={onTravelCurrenciesChange}
          />
          
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="text-sm font-bold text-primary">
              {currencySymbol} {Object.values(detailedBudget).reduce((a, b) => a + b, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </OptionCard>
    </div>
  );
}
