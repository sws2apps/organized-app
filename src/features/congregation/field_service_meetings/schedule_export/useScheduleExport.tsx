import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { IconInfo } from '@components/icons';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';
import { ScheduleExportScope, ScheduleExportType } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import {
  generateMonthNames,
  getMessageByCode,
} from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import { fieldServiceMeetingsActiveState } from '@states/field_service_meetings';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import {
  JWLangLocaleState,
  congNameState,
  userDataViewState,
} from '@states/settings';
import { headerForScheduleState } from '@states/field_service_groups';
import { formatDate, getWeekDate } from '@utils/date';
import { TemplateFieldServiceMeetings } from '@views/index';
import { FieldServiceMeetingTemplateMonth } from '@views/meetings/field_service/index.types';

const filterMeetingsByDataView = (
  meetings: FieldServiceMeetingType[],
  dataView: string
) => {
  return meetings.filter((record) => {
    if (!record) return false;

    if (dataView === 'main') {
      return true;
    }

    const recordType = record.meeting_data.type;
    const recordGroup = record.meeting_data.group_id;

    return (
      recordType === 'main' ||
      recordType === dataView ||
      recordGroup === dataView
    );
  });
};

const createTemplateMonths = (
  meetings: FieldServiceMeetingType[],
  lng: string
): FieldServiceMeetingTemplateMonth[] => {
  const monthNames = generateMonthNames(lng);

  const monthMap = new Map<
    string,
    {
      id: string;
      title: string;
      sortKey: string;
      days: Map<
        string,
        {
          id: string;
          dateLabel: string;
          sortKey: string;
          meetings: Array<
            FieldServiceMeetingTemplateMonth['days'][number]['meetings'][number] & {
              sortKey: string;
            }
          >;
        }
      >;
    }
  >();

  meetings.forEach((meeting) => {
    const formatted = fieldServiceMeetingData(meeting);

    formatted.dates.forEach((dateEntry, index) => {
      const currentDate = new Date(dateEntry.date);
      const monthIndex = currentDate.getMonth();
      const key = `${formatted.year}-${monthIndex}`;

      if (!monthMap.has(key)) {
        const titleMonth = monthNames[monthIndex] || '';
        monthMap.set(key, {
          id: key,
          title: `${titleMonth} ${formatted.year}`.trim(),
          sortKey: formatted.start,
          days: new Map(),
        });
      }

      const monthEntry = monthMap.get(key)!;
      const dayKey = dateEntry.date;

      if (!monthEntry.days.has(dayKey)) {
        monthEntry.days.set(dayKey, {
          id: dayKey,
          dateLabel: `${dateEntry.day}, ${dateEntry.dateFormatted}`,
          sortKey: dateEntry.date,
          meetings: [],
        });
      }

      const dayEntry = monthEntry.days.get(dayKey)!;
      dayEntry.meetings.push({
        id: `${formatted.uid}-${dayKey}-${index}`,
        time: formatted.time,
        address: formatted.address ?? '',
        conductor: formatted.conductor ?? '',
        sortKey: `${dayKey}-${formatted.start}-${index}`,
      });

      if (formatted.start < monthEntry.sortKey) {
        monthEntry.sortKey = formatted.start;
      }
    });
  });

  return Array.from(monthMap.values())
    .sort((first, second) => first.sortKey.localeCompare(second.sortKey))
    .map((month) => ({
      id: month.id,
      title: month.title,
      days: Array.from(month.days.values())
        .sort((first, second) => first.sortKey.localeCompare(second.sortKey))
        .map((day) => ({
          id: day.id,
          dateLabel: day.dateLabel,
          meetings: day.meetings
            .sort((first, second) =>
              first.sortKey.localeCompare(second.sortKey)
            )
            .map(({ ...meeting }) => meeting),
        })),
    }));
};

const useScheduleExport = (
  onClose: ScheduleExportType['onClose'],
  scope: ScheduleExportScope
) => {
  const { t } = useAppTranslation();

  const fieldServiceMeetings = useAtomValue(fieldServiceMeetingsActiveState);
  const dataView = useAtomValue(userDataViewState);
  const lng = useAtomValue(JWLangLocaleState);
  const congregationName = useAtomValue(congNameState);
  const headerName = useAtomValue(headerForScheduleState);

  const meetings = useMemo(
    () => filterMeetingsByDataView(fieldServiceMeetings, dataView),
    [fieldServiceMeetings, dataView]
  );

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const isStartWeekMissing = startWeek.length === 0;
  const isEndWeekMissing = endWeek.length === 0;
  const isValid = !isStartWeekMissing && !isEndWeekMissing;

  const handleSetStartWeek = (value: string) => {
    setStartWeek(value);
    setEndWeek('');

    if (showValidationErrors) {
      setShowValidationErrors(false);
    }
  };

  const handleSetEndWeek = (value: string) => {
    setEndWeek(value);

    if (showValidationErrors) {
      setShowValidationErrors(false);
    }
  };

  const filterByScope = (meeting: FieldServiceMeetingType) => {
    if (scope === 'joint') {
      return (
        meeting.meeting_data.category ===
        FieldServiceMeetingCategory.JointMeeting
      );
    }

    if (scope === 'specific') {
      return (
        meeting.meeting_data.category ===
          FieldServiceMeetingCategory.GroupMeeting ||
        Boolean(meeting.meeting_data.group_id?.length)
      );
    }

    return true;
  };

  const filterByWeekRange = (meeting: FieldServiceMeetingType) => {
    const weekOfMeeting = formatDate(
      getWeekDate(new Date(meeting.meeting_data.start)),
      'yyyy/MM/dd'
    );

    return weekOfMeeting >= startWeek && weekOfMeeting <= endWeek;
  };

  const handleExportSchedule = async () => {
    if (isProcessing) return;

    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }

    setIsProcessing(true);

    try {
      const meetingsToExport = meetings
        .filter(filterByScope)
        .filter(filterByWeekRange)
        .toSorted(
          (first, second) =>
            new Date(first.meeting_data.start).getTime() -
            new Date(second.meeting_data.start).getTime()
        );

      if (meetingsToExport.length === 0) {
        displaySnackNotification({
          header: t('tr_noFieldServiceMeetings'),
          message: t('tr_noFieldServiceMeetingsForRange'),
          severity: 'message-with-button',
          icon: <IconInfo color="var(--accent-main)" />,
        });

        return;
      }

      const months = createTemplateMonths(meetingsToExport, lng);
      const pdfGroupLabel =
        dataView === 'main'
          ? t('tr_allGroups', { lng })
          : headerName || t('tr_groupNameLabel', { lng });

      const blob = await pdf(
        <TemplateFieldServiceMeetings
          congregation={congregationName}
          groupLabel={pdfGroupLabel}
          lang={lng}
          months={months}
        />
      ).toBlob();

      const sanitizedStart = startWeek.replaceAll('/', '');
      const sanitizedEnd = endWeek.replaceAll('/', '');
      const filename = `field-service-meetings-${sanitizedStart}-${sanitizedEnd}.pdf`;

      saveAs(blob, filename);

      displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_fieldServiceMeetingExportSuccess'),
        severity: 'success',
      });

      onClose?.();
    } catch (error) {
      console.error(error);

      onClose?.();

      const message =
        error instanceof Error
          ? (getMessageByCode(error.message) ?? error.message)
          : String(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message,
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleSetStartWeek,
    handleSetEndWeek,
    isProcessing,
    handleExportSchedule,
    isValid,
    showValidationErrors,
    isStartWeekMissing,
    isEndWeekMissing,
    startWeek,
    endWeek,
  };
};

export default useScheduleExport;
