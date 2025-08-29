'use client';
import styles from './SuggestionsModal.module.css';
import SuggestionsCalendar, { MonthSlotType } from '@/components/layout/ThemeOverviewPanel/SuggestionsCalendar/SuggestionsCalendar';
import { useState } from 'react';
import { useAppSelector } from '@/state/hooks';
import Button from '../../Button/Button';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SuggestionModal() {
  const themes = useAppSelector((state) => state.theme.themes);
  const pollSuggestions = useAppSelector((state) => state.poll.suggestions) as PollOption[];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Build month slots
  const initialMonths: MonthSlotType[] = MONTHS.map((month, index) => {
    const theme = themes?.find((t) => new Date(t.theme_month).getFullYear() === currentYear && parseInt(t.theme_month.split('-')[1], 10) - 1 === index && t.type === 'final');

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

  // keep PollOption objects intact
  const [availableSuggestions, setAvailableSuggestions] = useState<PollOption[]>(pollSuggestions);
  const [months, setMonths] = useState(initialMonths);

  const visibleMonths = months.filter((month, index) => {
    const isPastMonth = currentYear < today.getFullYear() || (currentYear === today.getFullYear() && index < currentMonth);
    return !isPastMonth;
  });

  const handleAssign = (monthId: string | number, suggestionId: string) => {
    const suggestion = availableSuggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return;

    setMonths((prevMonths) =>
      prevMonths.map((month) => {
        if (month.id === monthId) {
          return {
            ...month,
            assignedSuggestion: suggestion,
            assignedTheme: suggestion.id,
            assignedThemeName: suggestion.name,
            image: suggestion.image_url ?? undefined,
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
      const filtered = prev.filter((s) => s.id !== suggestionId);

      const month = months.find((m) => m.id === monthId);
      if (month?.assignedTheme && month?.assignedThemeName) {
        filtered.push({
          ...month.assignedSuggestion!,
          id: month.assignedTheme,
          name: month.assignedThemeName,
          image_url: month.image as string,
        });
      }

      return filtered;
    });
  };

  const handleUnassign = (monthId: string) => {
    const month = months.find((m) => m.id === monthId);
    if (!month || !month.assignedSuggestion) return;

    const { assignedSuggestion } = month;

    setMonths((prev) =>
      prev.map((m) =>
        m.id === monthId
          ? {
              ...m,
              assignedSuggestion: undefined,
              assignedTheme: undefined,
              assignedThemeName: undefined,
              image: undefined,
            }
          : m
      )
    );

    setAvailableSuggestions((prev) => [...prev, assignedSuggestion]);
  };

  return (
    <div className={styles.modalWrapper}>
      <SuggestionsCalendar months={visibleMonths} suggestions={availableSuggestions} onAssign={handleAssign} onUnassign={handleUnassign} />
      <div className={styles.buttonWrapper}>
        <Button className={styles.confirmButton}>Confirm</Button>
      </div>
    </div>
  );
}
