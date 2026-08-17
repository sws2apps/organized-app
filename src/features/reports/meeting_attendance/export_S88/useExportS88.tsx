import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { displaySnackNotification } from '@services/states/app';
import {
  generateMonthNames,
  getMessageByCode,
  getTranslation,
} from '@services/i18n/translation';
import { createArrayFromMonths, currentServiceYear } from '@utils/date';
import { AttendanceExport, ColumnSource } from './index.types';
import {
  MeetingAttendanceExport,
  MeetingAttendanceStats,
} from '@definition/meeting_attendance';
import {
  attendanceDeafRecordState,
  JWLangLocaleState,
  JWLangState,
  languageGroupEnabledState,
} from '@states/settings';
import { meetingAttendanceState } from '@states/meeting_attendance';
import { languageGroupsState } from '@states/field_service_groups';
import { MeetingType } from '@definition/app';
import { meetingAttendanceGetStats } from '@services/app/meeting_attendance';
import TemplateS88 from '@views/reports/attendance';

const getCell = (stats?: MeetingAttendanceStats, deaf?: boolean) => {
  if (!stats) return { count: '', total: '', average: '' };

  return {
    count: stats.count || '',
    total: (deaf ? stats.total_deaf : stats.total) || '',
    average: (deaf ? stats.average_deaf : stats.average) || '',
  };
};

const getYearlyAverage = (column: ColumnSource, meeting: MeetingType) => {
  const values = column.months
    .map((month) =>
      column.deaf ? month[meeting].average_deaf : month[meeting].average
    )
    .filter((average) => average > 0);

  if (values.length === 0) return 0;

  const sum = values.reduce((acc, current) => acc + current, 0);

  return Math.round(sum / values.length);
};

const useExportS88 = () => {
  const attendances = useAtomValue(meetingAttendanceState);
  const lang = useAtomValue(JWLangState);
  const locale = useAtomValue(JWLangLocaleState);
  const languageGroups = useAtomValue(languageGroupsState);
  const languageGroupEnabled = useAtomValue(languageGroupEnabledState);
  const recordDeaf = useAtomValue(attendanceDeafRecordState);

  const [isProcessing, setIsProcessing] = useState(false);

  const monthNames = useMemo(() => generateMonthNames(locale), [locale]);

  const groups = useMemo(() => {
    if (!languageGroupEnabled) return [];

    return languageGroups.filter(
      (record) =>
        record.group_data.midweek_meeting ?? record.group_data.weekend_meeting
    );
  }, [languageGroupEnabled, languageGroups]);

  const getAttendanceDetails = (month: string, category: string) => {
    const attendance = attendances.find(
      (record) => record.month_date === month
    );

    const filter = category === 'main' ? undefined : category;

    return {
      midweek: meetingAttendanceGetStats(attendance, 'midweek', filter),
      weekend: meetingAttendanceGetStats(attendance, 'weekend', filter),
    };
  };

  const getYearlyData = (year: string, category: string) => {
    const months = createArrayFromMonths(`${+year - 1}/09`, `${year}/08`);

    return {
      year,
      months: months.map((month) => ({
        month,
        ...getAttendanceDetails(month, category),
      })),
    };
  };

  const buildPage = (name: string, columns: ColumnSource[]) => {
    const [column1, column2] = columns;

    const buildRows = (meeting: MeetingType) => {
      return column1.months.map((record, index) => {
        const monthIndex = +record.month.split('/')[1] - 1;

        return {
          month: monthNames[monthIndex],
          table_1: getCell(record[meeting], column1.deaf),
          table_2: getCell(column2.months.at(index)?.[meeting], column2.deaf),
        };
      });
    };

    return {
      name,
      columns: columns.map((column) => column.label),
      midweek_meeting: buildRows('midweek'),
      midweek_average: [
        getYearlyAverage(column1, 'midweek'),
        getYearlyAverage(column2, 'midweek'),
      ],
      weekend_meeting: buildRows('weekend'),
      weekend_average: [
        getYearlyAverage(column1, 'weekend'),
        getYearlyAverage(column2, 'weekend'),
      ],
    };
  };

  const buildCategoryPages = (category: AttendanceExport) => {
    if (!recordDeaf) {
      const columns: ColumnSource[] = [0, 1].map((index) => {
        const yearly = category.data.at(index);

        return yearly
          ? { label: yearly.year, months: yearly.months }
          : { label: '', months: [] };
      });

      return [buildPage(category.name, columns)];
    }

    const deafLabel = getTranslation({ key: 'tr_deaf', language: locale });

    return category.data.map((yearly) =>
      buildPage(category.name, [
        { label: yearly.year, months: yearly.months },
        { label: deafLabel, months: yearly.months, deaf: true },
      ])
    );
  };

  const handleExportS88 = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const currentYear = currentServiceYear();
      const years = [String(+currentYear - 1), currentYear];

      const categories: AttendanceExport[] = [
        { category: 'main', name: 'main' },
        ...groups.map((group) => ({
          category: group.group_id,
          name: group.group_data.name,
        })),
      ].map((category) => ({
        ...category,
        data: years
          .map((year) => getYearlyData(year, category.category))
          .filter((yearly) =>
            yearly.months.some(
              (record) => record.midweek.count > 0 || record.weekend.count > 0
            )
          ),
      }));

      if (categories.every((category) => category.data.length === 0)) {
        setIsProcessing(false);
        return;
      }

      const finalData: MeetingAttendanceExport = {
        lang,
        locale,
        data: categories
          .filter((category) => category.data.length > 0)
          .flatMap(buildCategoryPages),
      };

      const blob = await pdf(
        <TemplateS88 attendance={finalData} lang={lang} />
      ).toBlob();

      saveAs(blob, 'S-88.pdf');

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
