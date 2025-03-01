import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useCurrentUser } from '@hooks/index';
import { MeetingType } from '@definition/app';
import { languageGroupEnabledState } from '@states/settings';

export default function useSharedHook() {
  const { isGroup, languageGroup } = useCurrentUser();

  const languageGroupEnabled = useRecoilValue(languageGroupEnabledState);

  const meetings = useMemo(() => {
    const result: MeetingType[] = [];

    if (!isGroup) {
      result.push('midweek', 'weekend');
    }

    if (languageGroupEnabled && isGroup) {
      if (languageGroup?.midweek_meeting) {
        result.push('midweek');
      }

      if (languageGroup?.weekend_meeting) {
        result.push('weekend');
      }
    }

    return result;
  }, [isGroup, languageGroup, languageGroupEnabled]);

  return { meetings };
}
