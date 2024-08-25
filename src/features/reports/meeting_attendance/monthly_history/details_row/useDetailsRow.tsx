import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { DetailsRowProps } from './index.types';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { WeeklyAttendance } from '@definition/meeting_attendance';

const useDetailsRow = ({ type, month, meeting }: DetailsRowProps) => {
  const { t } = useAppTranslation();

  const attendances = useRecoilValue(meetingAttendanceState);

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
  }, [type, t]);

  const attendance = useMemo(() => {
    return attendances.find((record) => record.month_date === month);
  }, [attendances, month]);

  const value = useMemo(() => {
    if (!attendance) return '';

    const values: number[] = [];

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData[meeting];

      let total = 0;

      for (const data of meetingData) {
        if (data?.present || data?.online) {
          total += data?.present || 0;
          total += data?.online || 0;
        }
      }

      if (total > 0) {
        values.push(total);
      }
    }

    if (type === 'count') {
      return values.length;
    }

    const grandTotal = values.reduce((value, current) => {
      return value + current;
    }, 0);

    if (type === 'total') {
      return grandTotal;
    }

    const cnMeet = values.length;
    return grandTotal === 0 ? 0 : Math.round(grandTotal / cnMeet);
  }, [attendance, type, meeting]);

  return { label, value };
};

export default useDetailsRow;
