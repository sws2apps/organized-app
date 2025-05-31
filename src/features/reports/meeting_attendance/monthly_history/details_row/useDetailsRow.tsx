import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { DetailsRowProps } from './index.types';
import { meetingAttendanceState } from '@states/meeting_attendance';
import useMeetingAttendance from '../../hooks/useMeetingAttendance';

const useDetailsRow = ({ type, month, meeting }: DetailsRowProps) => {
  const { t } = useAppTranslation();

  const { midweek, weekend } = useMeetingAttendance(month);

  const attendances = useAtomValue(meetingAttendanceState);

  const label = useMemo(() => {
    if (type === 'count') {
      return t('tr_numberOfMeetings');
    }

    if (type === 'total') {
      return t('tr_totalAttendance');
    }

    if (type === 'average') {
      return t('tr_avgAttendance');
    }

    if (type === 'average_online') {
      return t('tr_avgOnline');
    }
  }, [type, t]);

  const attendance = useMemo(() => {
    return attendances.find((record) => record.month_date === month);
  }, [attendances, month]);

  const value = useMemo(() => {
    if (!attendance) return '';

    if (type === 'count') {
      if (meeting === 'midweek') {
        return midweek.count;
      }

      if (meeting === 'weekend') {
        return weekend.count;
      }
    }

    if (type === 'total') {
      if (meeting === 'midweek') {
        return midweek.total;
      }

      if (meeting === 'weekend') {
        return weekend.total;
      }
    }

    if (type === 'average') {
      if (meeting === 'midweek') {
        return midweek.average;
      }

      if (meeting === 'weekend') {
        return weekend.average;
      }
    }

    if (type === 'average_online') {
      if (meeting === 'midweek') {
        return midweek.average_online;
      }

      if (meeting === 'weekend') {
        return weekend.average_online;
      }
    }
  }, [attendance, type, meeting, midweek, weekend]);

  return { label, value };
};

export default useDetailsRow;
