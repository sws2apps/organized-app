import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';

export default function useSharedHook() {
  const { isGroup, languageGroup } = useCurrentUser();

  const showMidweek = useMemo(() => {
    if (!isGroup) return true;

    return languageGroup?.group_data.midweek_meeting ?? false;
  }, [isGroup, languageGroup]);

  const showWeekend = useMemo(() => {
    if (!isGroup) return true;

    return languageGroup?.group_data.weekend_meeting ?? false;
  }, [isGroup, languageGroup]);

  const showMeetingCard = useMemo(() => {
    return showMidweek || showWeekend;
  }, [showMidweek, showWeekend]);

  return { showMidweek, showWeekend, showMeetingCard };
}
