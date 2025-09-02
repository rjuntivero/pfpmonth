'use client';
import styles from './SuggestionsModal.module.css';
import SuggestionsCalendar, { MonthSlotType } from '@/components/layout/ThemeOverviewPanel/SuggestionsCalendar/SuggestionsCalendar';
import { useState } from 'react';
import { useAppSelector } from '@/state/hooks';
import Button from '../../Button/Button';
import { PollOption } from '@/lib/api/poll/fetchPollOptions';
import { MONTHS } from '@/lib/utils/stringUtils';
import getCookie from '@/lib/utils/getClientCookie';

export default function SuggestionModal() {
  const themes = useAppSelector((state) => state.theme.themes);
  const pollOptions = useAppSelector((state) => state.poll.pollOptions) as PollOption[];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const year = useAppSelector((state) => state.theme.year);

  // month slots
  const initialMonths: MonthSlotType[] = MONTHS.map((month, index) => {
    const theme = themes?.find((t) => new Date(t.theme_month).getFullYear() === currentYear && parseInt(t.theme_month.split('-')[1], 10) - 1 === index && t.type === 'final');

    const isPastMonth = currentYear < today.getFullYear() || (currentYear === today.getFullYear() && index < currentMonth);
    const isPreassigned = !!theme?.id && theme.name !== 'No Theme';

    return {
      id: month,
      month,
      assignedSuggestion: undefined,
      assignedTheme: theme?.id,
      assignedThemeName: theme?.name,
      isDisabled: isPastMonth,
      isPreassigned,
      image: theme?.image,
    };
  });

  const [availableSuggestions, setAvailableSuggestions] = useState<PollOption[]>(pollOptions);
  const [months, setMonths] = useState(initialMonths);

  const visibleMonths = months.filter((month, index) => {
    const isPastMonth = currentYear < today.getFullYear() || (currentYear === today.getFullYear() && index < currentMonth);
    return !isPastMonth;
  });

  const handleAssign = (monthId: string | number, suggestionId: string) => {
    const suggestion = availableSuggestions.find((s) => s.id === suggestionId);
    if (!suggestion) return;

    // console.log('Assign triggered');
    // console.log('Month ID:', monthId);
    // console.log('Suggestion being assigned:', suggestion);

    setMonths((prevMonths) =>
      prevMonths.map((month) => {
        if (month.id === monthId) {
          const updated = {
            ...month,
            assignedSuggestion: suggestion,
            assignedTheme: suggestion.id,
            assignedThemeName: suggestion.name,
            image: suggestion.image_url ?? undefined,
          };
          return updated;
        }
        return month;
      })
    );

    setAvailableSuggestions((prev) => {
      const filtered = prev.filter((s) => s.id !== suggestionId);

      const month = months.find((m) => m.id === monthId);
      if (month?.assignedSuggestion) {
        filtered.push(month.assignedSuggestion);
      }

      return filtered;
    });

    console.table(
      months.map((m) => ({
        id: m.id,
        assignedTheme: m.assignedTheme,
        assignedThemeName: m.assignedThemeName,
        assignedSuggestion: m.assignedSuggestion || null,
      }))
    );
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

    setAvailableSuggestions((prev) => {
      const updated = [...prev, assignedSuggestion];
      // console.log('available suggestions after unassign:', updated);
      return updated;
    });

    // console.table(
    //   months.map((m) => ({
    //     id: m.id,
    //     assignedTheme: m.assignedTheme,
    //     assignedThemeName: m.assignedThemeName,
    //     assignedSuggestion: m.assignedSuggestion || null,
    //   }))
    // );
  };

  // promote themes
  const handleConfirm = async () => {
    const serverId = getCookie('server_id');

    try {
      const res = await fetch('/api/polls/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ months, year, serverId }),
      });

      const data = await res.json();
      if (data.success) {
      } else {
        console.error('failed to promote:', data.error);
      }
    } catch (err) {
      console.error('error calling API:', err);
    }
  };
  return (
    <div className={styles.modalWrapper}>
      <SuggestionsCalendar months={visibleMonths} suggestions={availableSuggestions} onAssign={handleAssign} onUnassign={handleUnassign} />
      <div className={styles.buttonWrapper}>
        <Button onClick={handleConfirm} className={styles.confirmButton}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
