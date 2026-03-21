import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { displaySnackNotification } from '@services/states/app';
import {
  generateMonthNames,
  getMessageByCode,
} from '@services/i18n/translation';
import { createArrayFromMonths, currentServiceYear } from '@utils/date';
import { AttendanceExport, MonthData, YearlyData } from './index.types';
import {
  MeetingAttendanceExport,
  MeetingAttendanceType,
  WeeklyAttendance,
} from '@definition/meeting_attendance';
import {
  JWLangLocaleState,
  JWLangState,
  languageGroupEnabledState,
} from '@states/settings';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { languageGroupsState } from '@states/field_service_groups';
import { MeetingType } from '@definition/app';
import TemplateS88 from '@views/reports/attendance';

const useExportS88 = () => {
  const attendances = useAtomValue(meetingAttendanceState);
  const lang = useAtomValue(JWLangState);
  const locale = useAtomValue(JWLangLocaleState);
  const languageGroups = useAtomValue(languageGroupsState);
  const languageGroupEnabled = useAtomValue(languageGroupEnabledState);

  const [isProcessing, setIsProcessing] = useState(false);

  const groups = useMemo(() => {
    if (!languageGroupEnabled) return [];

    return languageGroups.filter(
      (record) =>
        record.group_data.midweek_meeting ?? record.group_data.weekend_meeting
    );
  }, [languageGroupEnabled, languageGroups]);

  const getAttendance = (month: string) => {
    return attendances.find((record) => record.month_date === month);
  };

  const getMidweekOnline = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.midweek;

      if (category !== 'main') {
        meetingData = meetingData.filter((record) => record.type === category);
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.online) {
          return acc + current.online;
        }

        return acc;
      }, 0);
    }

    return total;
  };

  const getWeekendOnline = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.weekend;

      if (category !== 'main') {
        meetingData = meetingData.filter((record) => record.type === category);
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.online) {
          return acc + current.online;
        }

        return acc;
      }, 0);
    }

    return total;
  };

  const getMidweekTotal = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.midweek;

      if (category !== 'main') {
        meetingData = meetingData.filter((record) => record.type === category);
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.present) {
          return acc + current.present;
        }

        return acc;
      }, 0);
    }

    const midweek_online = getMidweekOnline(attendance, category);

    return total + midweek_online;
  };

  const getWeekendTotal = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    let total = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.weekend;

      if (category !== 'main') {
        meetingData = meetingData.filter((record) => record.type === category);
      }

      total += meetingData.reduce((acc, current) => {
        if (current?.present) {
          return acc + current.present;
        }

        return acc;
      }, 0);
    }

    const weekend_online = getWeekendOnline(attendance, category);

    return total + weekend_online;
  };

  const getMidweekCount = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    let count = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.midweek;

      if (category !== 'main') {
        meetingData = meetingData.filter((record) => record.type === category);
      }

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

  const getWeekendCount = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    let count = 0;

    for (let i = 1; i <= 5; i++) {
      const weekData = attendance[`week_${i}`] as WeeklyAttendance;

      let meetingData = weekData.weekend;

      if (category !== 'main') {
        meetingData = meetingData.filter((record) => record.type === category);
      }

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

  const getMidweekAverage = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    const midweek_total = getMidweekTotal(attendance, category);
    const midweek_count = getMidweekCount(attendance, category);

    const average =
      midweek_total === 0 ? 0 : Math.round(midweek_total / midweek_count);

    return average;
  };

  const getWeekendAverage = (
    attendance: MeetingAttendanceType,
    category: string
  ) => {
    if (!attendance) return 0;

    const weekend_total = getWeekendTotal(attendance, category);
    const weekend_count = getWeekendCount(attendance, category);

    const average =
      weekend_total === 0 ? 0 : Math.round(weekend_total / weekend_count);

    return average;
  };

  const getAttendanceDetails = (month: string, category: string) => {
    const attendance = getAttendance(month);

    return {
      midweek: {
        count: getMidweekCount(attendance, category),
        total: getMidweekTotal(attendance, category),
        average: getMidweekAverage(attendance, category),
      },
      weekend: {
        count: getWeekendCount(attendance, category),
        total: getWeekendTotal(attendance, category),
        average: getWeekendAverage(attendance, category),
      },
    };
  };

  const getYearlyMeetingAverage = (
    months: MonthData[],
    meeting: MeetingType
  ) => {
    const values: number[] = [];

    for (const month of months) {
      const avg = month[meeting].average;

      if (avg > 0) values.push(avg);
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

      const main = {
        category: 'main',
        name: 'main',
        data: [],
      } as AttendanceExport;

      for (const year of years) {
        const obj = { year, months: [] };

        const startMonth = `${+year - 1}/09`;
        const endMonth = `${year}/08`;
        const months = createArrayFromMonths(startMonth, endMonth);

        for (const month of months) {
          const attendance = getAttendanceDetails(month, main.category);
          obj.months.push({ month, ...attendance });
        }

        main.data.push(obj);
      }

      result.push(main);

      for (const group of groups) {
        const groupData = {
          category: group.group_id,
          name: group.group_data.name,
          data: [],
        } as AttendanceExport;

        for (const year of years) {
          const obj = { year, months: [] };

          const startMonth = `${+year - 1}/09`;
          const endMonth = `${year}/08`;
          const months = createArrayFromMonths(startMonth, endMonth);

          for (const month of months) {
            const attendance = getAttendanceDetails(month, groupData.category);
            obj.months.push({ month, ...attendance });
          }

          groupData.data.push(obj);
        }

        result.push(groupData);
      }

      // remove service year with no data
      const resultClean = result.reduce((acc: AttendanceExport[], current) => {
        const newCurrent = current.data.reduce(
          (childAcc: YearlyData[], childCurrent) => {
            const hasData = childCurrent.months.some(
              (record) => record.midweek.count > 0 || record.weekend.count > 0
            );

            if (hasData) {
              childAcc.push(childCurrent);
            }

            return childAcc;
          },
          []
        );

        acc.push({ ...current, data: newCurrent });

        return acc;
      }, []);

      if (resultClean.length === 0 || resultClean?.at(0).data.length === 0) {
        setIsProcessing(false);
        return;
      }

      const monthNames = generateMonthNames(locale);

      const finalData: MeetingAttendanceExport = {
        lang,
        locale,
        data: resultClean
          .filter((record) => record.data.length > 0)
          .map((category) => {
            const year1 = category.data.at(0).year;
            const year2 = category.data.at(1)?.year;

            return {
              name: category.name,
              years: [year1, year2 || ''],
              midweek_meeting: category.data
                .at(0)
                .months.map((record, index) => {
                  const table1 = category.data.at(0).months.at(index);
                  const table2 = category.data.at(1)?.months.at(index);

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
                getYearlyMeetingAverage(category.data.at(0).months, 'midweek'),
                year2
                  ? getYearlyMeetingAverage(
                      category.data.at(1)?.months ?? [],
                      'midweek'
                    )
                  : 0,
              ],
              weekend_meeting: category.data
                .at(0)
                .months.map((record, index) => {
                  const table1 = category.data.at(0).months.at(index);
                  const table2 = category.data.at(1)?.months.at(index);

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
                getYearlyMeetingAverage(category.data.at(0).months, 'weekend'),
                year2
                  ? getYearlyMeetingAverage(
                      category.data.at(1)?.months ?? [],
                      'weekend'
                    )
                  : 0,
              ],
            };
          }),
      };

      const blob = await pdf(
        <TemplateS88 attendance={finalData} lang={lang} />
      ).toBlob();

      const filename = `S-88.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { isProcessing, handleExportS88 };
};

export default useExportS88;
