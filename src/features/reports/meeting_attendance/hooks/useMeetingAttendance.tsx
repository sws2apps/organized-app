import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useCurrentUser } from '@hooks/index';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { WeeklyAttendance } from '@definition/meeting_attendance';

const useMeetingAttendance = (month: string) => {
  const { isGroup, languageGroup } = useCurrentUser();

  const attendances = useAtomValue(meetingAttendanceState);

  const attendance = useMemo(() => {
    return attendances.find((record) => record.month_date === month);
  }, [attendances, month]);

  const midweek_online = useMemo(() => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.midweek;

      if (isGroup) {
        meetingData = meetingData.filter(
          (record) => record.type === languageGroup?.group_id
        );
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.online) {
          return acc + current.online;
        }

        return acc;
      }, 0);
    }

    return total;
  }, [attendance, isGroup, languageGroup]);

  const weekend_online = useMemo(() => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.weekend;

      if (isGroup) {
        meetingData = meetingData.filter(
          (record) => record.type === languageGroup?.group_id
        );
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.online) {
          return acc + current.online;
        }

        return acc;
      }, 0);
    }

    return total;
  }, [attendance, isGroup, languageGroup]);

  const midweek_total = useMemo(() => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.midweek;

      if (isGroup) {
        meetingData = meetingData.filter(
          (record) => record.type === languageGroup?.group_id
        );
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.present) {
          return acc + current.present;
        }

        return acc;
      }, 0);
    }

    return total + midweek_online;
  }, [attendance, midweek_online, isGroup, languageGroup]);

  const weekend_total = useMemo(() => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.weekend;

      if (isGroup) {
        meetingData = meetingData.filter(
          (record) => record.type === languageGroup?.group_id
        );
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.present) {
          return acc + current.present;
        }

        return acc;
      }, 0);
    }

    return total + weekend_online;
  }, [attendance, weekend_online, isGroup, languageGroup]);

  const midweek_count = useMemo(() => {
    if (!attendance) return 0;

    let count = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.midweek;

      if (isGroup) {
        meetingData = meetingData.filter(
          (record) => record.type === languageGroup?.group_id
        );
      }

      const total = meetingData.reduce((acc, current) => {
        let value = acc;

        if (current?.present) {
          value += value + current.present;
        }

        if (current?.online) {
          value += value + current.online;
        }

        return value;
      }, 0);

      if (total > 0) count++;
    }

    return count;
  }, [attendance, isGroup, languageGroup]);

  const weekend_count = useMemo(() => {
    if (!attendance) return 0;

    let count = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.weekend;

      if (isGroup) {
        meetingData = meetingData.filter(
          (record) => record.type === languageGroup?.group_id
        );
      }

      const total = meetingData.reduce((acc, current) => {
        let value = acc;

        if (current?.present) {
          value += value + current.present;
        }

        if (current?.online) {
          value += value + current.online;
        }

        return value;
      }, 0);

      if (total > 0) count++;
    }

    return count;
  }, [attendance, isGroup, languageGroup]);

  const midweek_average = useMemo(() => {
    if (!attendance) return 0;

    const average =
      midweek_total === 0 ? 0 : Math.round(midweek_total / midweek_count);

    return average;
  }, [attendance, midweek_total, midweek_count]);

  const weekend_average = useMemo(() => {
    if (!attendance) return 0;

    const average =
      weekend_total === 0 ? 0 : Math.round(weekend_total / weekend_count);

    return average;
  }, [attendance, weekend_total, weekend_count]);

  const midweek_average_online = useMemo(() => {
    if (!attendance) return '0%';

    const avgOnline =
      midweek_online === 0 ? 0 : Math.round(midweek_online / midweek_count);

    const percent =
      midweek_average === 0
        ? 0
        : Math.round((avgOnline * 100) / midweek_average);

    return `${avgOnline} (${percent}%)`;
  }, [attendance, midweek_average, midweek_online, midweek_count]);

  const weekend_average_online = useMemo(() => {
    if (!attendance) return '0%';

    const avgOnline =
      weekend_online === 0 ? 0 : Math.round(weekend_online / weekend_count);

    const percent =
      weekend_average === 0
        ? 0
        : Math.round((avgOnline * 100) / weekend_average);

    return `${avgOnline} (${percent}%)`;
  }, [attendance, weekend_average, weekend_online, weekend_count]);

  return {
    midweek: {
      count: midweek_count,
      total: midweek_total,
      average: midweek_average,
      average_online: midweek_average_online,
    },
    weekend: {
      count: weekend_count,
      total: weekend_total,
      average: weekend_average,
      average_online: weekend_average_online,
    },
  };
};

export default useMeetingAttendance;
