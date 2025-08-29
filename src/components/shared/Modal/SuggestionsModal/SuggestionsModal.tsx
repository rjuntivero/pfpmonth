'use client';
import { Slide } from '@/types/Slide';
import styles from './SuggestionsModal.module.css';
import { Poll } from '@/types/Polls';
import SuggestionsCalendar, { MonthSlotType, SuggestionType } from '@/components/layout/ThemeOverviewPanel/SuggestionsCalendar/SuggestionsCalendar';
import { useState } from 'react';
import { useAppSelector } from '@/state/hooks';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SuggestionModal() {
  const themes = useAppSelector((state) => state.theme.themes);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // build month slots
  const initialMonths: MonthSlotType[] = MONTHS.map((month, index) => {
    const theme = themes?.find((t) => new Date(t.theme_month).getMonth() === index);
    const isPastMonth = currentYear < today.getFullYear() || (currentYear === today.getFullYear() && index < currentMonth);
    const isPreassigned = !!theme?.id && theme.name !== 'No Theme';

    return {
      id: month,
      month,
      assignedTheme: theme?.id,
      assignedThemeName: theme?.name,
      isDisabled: isPastMonth,
      isPreassigned,
      image: theme?.image,
    };
  });

  const initialSuggestions: SuggestionType[] = [
    { id: 's1', name: 'Superhero Theme', image: '/bubblegum.jpg' },
    { id: 's2', name: 'Halloween Vibes', image: '/bubblegum.jpg' },
    { id: 's3', name: 'Winter Wonderland', image: '/bubblegum.jpg' },
    { id: 's4', name: 'Beach Party', image: '/bubblegum.jpg' },
  ];

  const [availableSuggestions, setAvailableSuggestions] = useState<SuggestionType[]>(initialSuggestions);
  const [months, setMonths] = useState<MonthSlotType[]>(initialMonths);
  const visibleMonths = months.filter((month, index) => {
    const isPastMonth = currentYear < today.getFullYear() || (currentYear === today.getFullYear() && index < currentMonth);
    return !isPastMonth;
  });
  //   // transform suggestions for DnD
  //   const suggestionItems: SuggestionType[] =
  //     availableSuggestions
  //       ?.map((s) => {
  //         if (!s.id || !s.name) return null;
  //         return {
  //           id: s.id,
  //           name: s.name,
  //         };
  //       })
  //       .filter((s): s is SuggestionType => s !== null) ?? [];

  const handleAssign = (monthId: string | number, suggestionId: string) => {
    const suggestion = availableSuggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return;

    setMonths((prevMonths) =>
      prevMonths.map((month) => {
        if (month.id === monthId) {
          return {
            ...month,
            assignedTheme: suggestion.id,
            assignedThemeName: suggestion.name,
            image: suggestion.image,
            // save previous assigned suggestion in a temporary property if needed
            previousAssigned: month.assignedTheme
              ? {
                  id: month.assignedTheme,
                  name: month.assignedThemeName!,
                  image: month.image,
                }
              : undefined,
          };
        }
        return month;
      })
    );

    setAvailableSuggestions((prev) => {
      // Remove the newly assigned suggestion
      const filtered = prev.filter((s) => s.id !== suggestionId);

      // If the month had a previous suggestion, add it back
      const month = months.find((m) => m.id === monthId);
      if (month?.assignedTheme && month?.assignedThemeName) {
        filtered.push({
          id: month.assignedTheme,
          name: month.assignedThemeName,
          image: month.image,
        });
      }

      return filtered;
    });
  };

  const handleUnassign = (monthId: string) => {
    const month = months.find((m) => m.id === monthId);
    if (!month || !month.assignedTheme || !month.assignedThemeName) return;

    const { assignedTheme, assignedThemeName, image } = month;

    // Clear month
    setMonths((prev) => prev.map((m) => (m.id === monthId ? { ...m, assignedTheme: undefined, assignedThemeName: undefined, image: undefined } : m)));

    // Add back to pool
    setAvailableSuggestions((prev) => [...prev, { id: assignedTheme, name: assignedThemeName, image: image }]);
  };

  return (
    <div className={styles.modalWrapper}>
      <h2 className={styles.yearTitle}>2025 Overview</h2>
      <SuggestionsCalendar months={visibleMonths} suggestions={availableSuggestions} onAssign={handleAssign} onUnassign={handleUnassign} />
    </div>
  );
}
