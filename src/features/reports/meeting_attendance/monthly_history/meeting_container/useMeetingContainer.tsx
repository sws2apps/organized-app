import { useAtomValue } from 'jotai';
import { DetailsRowProps } from '../details_row/index.types';
import { attendanceOnlineRecordState } from '@states/settings';
import { useMemo } from 'react';

const useMeetingContainer = () => {
  const recordOnline = useAtomValue(attendanceOnlineRecordState);

  const labels = useMemo(() => {
    const base: DetailsRowProps['type'][] = ['count', 'total', 'average'];

    if (recordOnline) {
      base.push('average_online');
    }

    return base;
  }, [recordOnline]);

  return { labels };
};

export default useMeetingContainer;
