import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { createArrayFromMonths, currentServiceYear } from '@utils/date';
import { AttendanceExport } from './index.types';
import { monthNamesState } from '@states/app';
import {
  MeetingAttendanceExport,
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import { JWLangLocaleState, JWLangState } from '@states/settings';
import { meetingAttendanceState } from '@states/meeting_attendance';
import TemplateS88 from '@views/reports/attendance';
import { MeetingType } from '@definition/app';

const useExportS88 = () => {
  const attendances = useRecoilValue(meetingAttendanceState);
  const monthNames = useRecoilValue(monthNamesState);
  const lang = useRecoilValue(JWLangState);
  const locale = useRecoilValue(JWLangLocaleState);

  const [isProcessing, setIsProcessing] = useState(false);

  const getAttendance = (month: string) => {
    return attendances.find((record) => record.month_date === month);
  };

  const getMidweekOnline = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData.midweek;

      total += meetingData.reduce((acc, current) => {
        if (current?.online) {
          return acc + current.online;
        }

        return acc;
      }, 0);
    }

    return total;
  };

  const getWeekendOnline = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData.weekend;

      total += meetingData.reduce((acc, current) => {
        if (current?.online) {
          return acc + current.online;
        }

        return acc;
      }, 0);
    }

    return total;
  };

  const getMidweekTotal = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData.midweek;

      total += meetingData.reduce((acc, current) => {
        if (current?.present) {
          return acc + current.present;
        }

        return acc;
      }, 0);
    }

    const midweek_online = getMidweekOnline(attendance);

    return total + midweek_online;
  };

  const getWeekendTotal = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData.weekend;

      total += meetingData.reduce((acc, current) => {
        if (current?.present) {
          return acc + current.present;
        }

        return acc;
      }, 0);
    }

    const weekend_online = getWeekendOnline(attendance);

    return total + weekend_online;
  };

  const getMidweekCount = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    let count = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData.midweek;

      const total = meetingData.reduce((acc, current) => {
        let value = acc;

        if (current?.present) {
          value += current.present;
        }

        if (current?.online) {
          value += current.online;
        }

        return value;
      }, 0);

      if (total > 0) count++;
    }

    return count;
  };

  const getWeekendCount = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    let count = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;
      const meetingData = weekData.weekend;

      const total = meetingData.reduce((acc, current) => {
        let value = acc;

        if (current?.present) {
          value += current.present;
        }

        if (current?.online) {
          value += current.online;
        }

        return value;
      }, 0);

      if (total > 0) count++;
    }

    return count;
  };

  const getMidweekAverage = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    const midweek_total = getMidweekTotal(attendance);
    const midweek_count = getMidweekCount(attendance);

    const average =
      midweek_total === 0 ? 0 : Math.round(midweek_total / midweek_count);

    return average;
  };

  const getWeekendAverage = (attendance: MeetingAttendanceType) => {
    if (!attendance) return 0;

    const weekend_total = getWeekendTotal(attendance);
    const weekend_count = getWeekendCount(attendance);

    const average =
      weekend_total === 0 ? 0 : Math.round(weekend_total / weekend_count);

    return average;
  };

  const getAttendanceDetails = (month: string) => {
    const attendance = getAttendance(month);

    return {
      midweek: {
        count: getMidweekCount(attendance),
        total: getMidweekTotal(attendance),
        average: getMidweekAverage(attendance),
      },
      weekend: {
        count: getWeekendCount(attendance),
        total: getWeekendTotal(attendance),
        average: getWeekendAverage(attendance),
      },
    };
  };

  const getReports = (year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    return attendances.filter(
      (record) =>
        record.month_date >= startMonth && record.month_date <= endMonth
    );
  };

  const getYearlyMeetingAverage = (year: string, meeting: MeetingType) => {
    const reports = getReports(year);

    if (reports.length === 0) return 0;

    const values: number[] = [];

    for (const attendance of reports) {
      for (let i = 1; i <= 5; i++) {
        let total = 0;

        const weekData = attendance[`week_${i}`] as WeeklyAttendance;
        const meetingData = weekData[meeting];

        total += meetingData.reduce((acc, current) => {
          if (current?.online) {
            return acc + current.online;
          }

          if (current?.present) {
            return acc + current.present;
          }

          return acc;
        }, 0);

        if (total > 0) values.push(total);
      }
    }

    const sum = values.reduce((acc, current) => acc + current, 0);

    if (sum === 0) return 0;

    return Math.round(sum / values.length);
  };

  const handleExportS88 = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const result: AttendanceExport[] = [];

      const years = [currentServiceYear()];
      years.unshift(String(+years - 1));

      for (const year of years) {
        const obj: AttendanceExport = { year, months: [] };
        const startMonth = `${+year - 1}/09`;
        const endMonth = `${year}/08`;
        const months = createArrayFromMonths(startMonth, endMonth);

        for (const month of months) {
          const attendance = getAttendanceDetails(month);
          obj.months.push({ month, ...attendance });
        }

        result.push(obj);
      }

      // remove service year with no data
      const resultClean = result.reduce((acc: AttendanceExport[], current) => {
        const hasData = current.months.some(
          (record) => record.midweek.count > 0 || record.weekend.count > 0
        );

        if (hasData) {
          acc.push(current);
        }

        return acc;
      }, []);

      if (resultClean.length === 0) {
        setIsProcessing(false);
        return;
      }

      const year1 = resultClean.at(0).year;
      const year2 = resultClean.at(1)?.year;

      const finalData: MeetingAttendanceExport = {
        lang,
        locale,
        years: [year1, year2 || ''],
        midweek_meeting: resultClean.at(0).months.map((record, index) => {
          const table1 = resultClean.at(0).months.at(index);
          const table2 = resultClean.at(1)?.months.at(index);

          const monthIndex = +record.month.split('/')[1] - 1;

          return {
            month: monthNames[monthIndex],
            table_1: {
              count: table1.midweek.count || '',
              total: table1.midweek.total || '',
              average: table1.midweek.average || '',
            },
            table_2: {
              count: table2?.midweek.count || '',
              total: table2?.midweek.total || '',
              average: table2?.midweek.average || '',
            },
          };
        }),
        midweek_average: [
          getYearlyMeetingAverage(year1, 'midweek'),
          year2 ? getYearlyMeetingAverage(year2, 'midweek') : 0,
        ],
        weekend_meeting: resultClean.at(0).months.map((record, index) => {
          const table1 = resultClean.at(0).months.at(index);
          const table2 = resultClean.at(1)?.months.at(index);

          const monthIndex = +record.month.split('/')[1] - 1;

          return {
            month: monthNames[monthIndex],
            table_1: {
              count: table1.weekend.count || '',
              total: table1.weekend.total || '',
              average: table1.weekend.average || '',
            },
            table_2: {
              count: table2?.weekend.count || '',
              total: table2?.weekend.total || '',
              average: table2?.weekend.average || '',
            },
          };
        }),
        weekend_average: [
          getYearlyMeetingAverage(year1, 'weekend'),
          year2 ? getYearlyMeetingAverage(year2, 'weekend') : 0,
        ],
      };

      const blob = await pdf(<TemplateS88 data={finalData} />).toBlob();

      const filename = `S-88.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { isProcessing, handleExportS88 };
};

export default useExportS88;
