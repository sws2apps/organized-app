import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { DetailsRowProps } from '../details_row/index.types';
import {
  attendanceDeafRecordState,
  attendanceOnlineRecordState,
} from '@states/settings';

const useMeetingContainer = () => {
  const recordOnline = useAtomValue(attendanceOnlineRecordState);
  const recordDeaf = useAtomValue(attendanceDeafRecordState);

  const labels = useMemo(() => {
    const base: DetailsRowProps['type'][] = ['count', 'total', 'average'];

    if (recordOnline) {
      base.push('average_online');
    }

    if (recordDeaf) {
      base.push('total_deaf', 'average_deaf');
    }

    return base;
  }, [recordOnline, recordDeaf]);

  return { labels };
};

export default useMeetingContainer;
