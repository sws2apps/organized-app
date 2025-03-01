import { useMemo } from 'react';
import { useCurrentUser } from '@hooks/index';
import { MeetingType } from '@definition/app';

export default function useSharedHook() {
  const { isGroup, languageGroup } = useCurrentUser();

  const meetings = useMemo(() => {
    const result: MeetingType[] = [];

    if (!isGroup) {
      result.push('midweek', 'weekend');
    }

    if (isGroup) {
      if (languageGroup?.midweek_meeting) {
        result.push('midweek');
      }

      if (languageGroup?.weekend_meeting) {
        result.push('weekend');
      }
    }

    return result;
  }, [isGroup, languageGroup]);

  return { meetings };
}
