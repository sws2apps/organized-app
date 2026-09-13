import { useMemo } from 'react';
import { useAppTranslation } from '@hooks/index';
import { DetailsRowProps } from './index.types';
import useMeetingAttendance from '../../hooks/useMeetingAttendance';

const useDetailsRow = ({ type, month, meeting }: DetailsRowProps) => {
  const { t } = useAppTranslation();

  const { midweek, weekend, hasRecord } = useMeetingAttendance(month);

  const label = useMemo(() => {
    const labels: Record<DetailsRowProps['type'], string> = {
      count: t('tr_numberOfMeetings'),
      total: t('tr_totalAttendance'),
      average: t('tr_avgAttendance'),
      average_online: t('tr_avgOnline'),
      total_deaf: t('tr_totalAttendanceDeaf'),
      average_deaf: t('tr_avgAttendanceDeaf'),
    };

    return labels[type];
  }, [type, t]);

  const value = useMemo(() => {
    if (!hasRecord) return '';

    const stats = meeting === 'midweek' ? midweek : weekend;

    if (type !== 'average_online') return stats[type];

    const percent =
      stats.average === 0
        ? 0
        : Math.round((stats.average_online * 100) / stats.average);

    return `${stats.average_online} (${percent}%)`;
  }, [type, meeting, midweek, weekend, hasRecord]);

  return { label, value };
};

export default useDetailsRow;
