import { parseSlug } from '@/lib/utils/stringUtils';
import ThemePage from '@/components/views/ThemeViews/ThemePage/ThemePage';
import SuggestionPage from '@/components/views/ThemeViews/SuggestionPage/SuggestionPage';
import EmptyPage from '@/components/views/ThemeViews/EmptyPage/EmptyPage';
import LockedPage from '@/components/views/ThemeViews/LockedPage/LockedPage';

import { fetchThemes } from '@/lib/api/theme/fetchThemes';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  const [dateString, dateObj] = parsed ?? ['', null];
  const themeMonth = dateString;

  const now = new Date();
  const nowUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const isPast = dateObj && dateObj < nowUTC;
  const { themes: slides } = await fetchThemes(dateObj?.getFullYear() ?? now.getFullYear());
  console.log('FETCHED SLIDES: ', slides);

  const currentSlide = slides.find((s) => s.theme_month === themeMonth);
  console.log('CURRENT SLIDE CLICKED: ', currentSlide);

  if (!currentSlide) {
    return <EmptyPage slug={slug} />;
  }

  if (currentSlide.type === 'final') {
    return <ThemePage inPast={isPast as boolean} theme={currentSlide} />;
  }

  if (currentSlide.type === 'suggestion') {
    return <SuggestionPage suggestionId={currentSlide.id as string} themeMonth={themeMonth} />;
  }

  if (currentSlide.type === 'tbd' && isPast) {
    return <LockedPage slug={slug} />;
  }

  return <EmptyPage slug={slug} />;
}
