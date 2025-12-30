import { useState, useEffect, useCallback, useRef } from 'react';

const DRAFT_KEY = 'ketravelan-draft-trip';
const DEBOUNCE_MS = 500;

export interface TripDraft {
  // Step 1
  visibility: 'public' | 'private';
  
  // Step 2 - Basics
  title: string;
  primaryDestination: string;
  additionalStops: string[];
  dateType: 'flexible' | 'exact';
  startDate: string;
  endDate: string;
  travelStyles: string[];
  groupSizeType: 'later' | 'set';
  groupSize: number;
  coverImage: string;
  
  // Step 3 - Plan
  budgetType: 'skip' | 'rough' | 'detailed';
  roughBudgetTotal: number;
  roughBudgetCategories: string[];
  detailedBudget: Record<string, number>;
  
  itineraryType: 'skip' | 'notes' | 'dayByDay';
  simpleNotes: string;
  dayByDayPlan: { day: number; activities: string[] }[];
  
  expectations: string[];
  
  // Meta
  lastSaved?: number;
}

export const getDefaultDraft = (): TripDraft => ({
  visibility: 'public',
  title: '',
  primaryDestination: '',
  additionalStops: [],
  dateType: 'flexible',
  startDate: '',
  endDate: '',
  travelStyles: [],
  groupSizeType: 'later',
  groupSize: 3,
  coverImage: '',
  budgetType: 'skip',
  roughBudgetTotal: 0,
  roughBudgetCategories: [],
  detailedBudget: {},
  itineraryType: 'skip',
  simpleNotes: '',
  dayByDayPlan: [],
  expectations: [],
});

export function useDraftTrip() {
  const [draft, setDraft] = useState<TripDraft>(getDefaultDraft);
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TripDraft;
        setDraft(parsed);
        setHasDraft(true);
        if (parsed.lastSaved) {
          setLastSaved(new Date(parsed.lastSaved));
        }
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }, []);

  // Save draft with debounce
  const saveDraft = useCallback((data: TripDraft) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      try {
        const toSave = { ...data, lastSaved: Date.now() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
        setLastSaved(new Date());
        setHasDraft(true);
      } catch (e) {
        console.error('Failed to save draft:', e);
      }
    }, DEBOUNCE_MS);
  }, []);

  // Update draft field
  const updateDraft = useCallback(<K extends keyof TripDraft>(
    field: K,
    value: TripDraft[K]
  ) => {
    setDraft(prev => {
      const updated = { ...prev, [field]: value };
      saveDraft(updated);
      return updated;
    });
  }, [saveDraft]);

  // Clear draft
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setDraft(getDefaultDraft());
      setHasDraft(false);
      setLastSaved(null);
    } catch (e) {
      console.error('Failed to clear draft:', e);
    }
  }, []);

  // Reset to default (for "Start Fresh")
  const resetDraft = useCallback(() => {
    const fresh = getDefaultDraft();
    setDraft(fresh);
    saveDraft(fresh);
  }, [saveDraft]);

  return {
    draft,
    setDraft,
    updateDraft,
    saveDraft,
    clearDraft,
    resetDraft,
    hasDraft,
    lastSaved,
  };
}
