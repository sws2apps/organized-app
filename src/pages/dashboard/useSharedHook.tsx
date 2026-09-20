import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';

export default function useSharedHook() {
  const { isGroup, languageGroup, isDutiesEditor } = useCurrentUser();

  const showMidweek = useMemo(() => {
    if (!isGroup) return true;

    return languageGroup?.group_data.midweek_meeting ?? false;
  }, [isGroup, languageGroup]);

  const showWeekend = useMemo(() => {
    if (!isGroup) return true;

    return languageGroup?.group_data.weekend_meeting ?? false;
  }, [isGroup, languageGroup]);

  const showDuties = useMemo(() => {
    if (!isGroup) return true;

    return showMidweek || showWeekend;
  }, [isGroup, showMidweek, showWeekend]);

  const showMeetingCard = useMemo(() => {
    return showMidweek || showWeekend || isDutiesEditor;
  }, [showMidweek, showWeekend, isDutiesEditor]);

  return { showMidweek, showWeekend, showMeetingCard, showDuties };
}
