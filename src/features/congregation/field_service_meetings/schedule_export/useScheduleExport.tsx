import {
  fieldServiceMeetingLabel,
  fieldServiceMeetingLocationLabel,
} from '@utils/field_service_meeting_labels';
import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { IconInfo } from '@components/icons';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';
import {
  ScheduleExportScope,
  ScheduleExportType,
} from '@features/congregation/field_service_meetings/schedule_export/index.types';
import { displaySnackNotification } from '@services/states/app';
import {
  generateMonthNames,
  getMessageByCode,
  getTranslation,
} from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import {
  fieldServiceMeetingsState,
  fieldServiceMeetingsWeekRangeState,
} from '@states/field_service_meetings';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import {
  congNameState,
  JWLangLocaleState,
  userDataViewState,
} from '@states/settings';
import { headerForScheduleState } from '@states/field_service_groups';
import { formatDate, weeksInMonth } from '@utils/date';
import { TemplateFieldServiceMeetings } from '@views/index';
import { FieldServiceMeetingTemplateMonth } from '@views/meetings/field_service/index.types';
import {
  fieldServiceMeetingOverlapsRange,
  fieldServiceMeetingWeek,
} from '@utils/field_service_meetings';
import { filterMeetingsByDataView } from '@features/congregation/field_service_meetings/filter_meetings_by_data_view';

const SHORT_WEEKDAY_KEYS = [
  'tr_sundayShort',
  'tr_mondayShort',
  'tr_tuesdayShort',
  'tr_wednesdayShort',
  'tr_thursdayShort',
  'tr_fridayShort',
  'tr_saturdayShort',
];

const createTemplateMonths = (
  meetings: FieldServiceMeetingType[],
  lng: string,
  startDate: string,
  endDate: string
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
    const formatted = fieldServiceMeetingData(meeting, lng);

    formatted.dates.forEach((dateEntry, index) => {
      if (dateEntry.date < startDate || dateEntry.date > endDate) return;
      const currentDate = new Date(dateEntry.date);
      const monthIndex = currentDate.getMonth();
      // The meeting's own year is its start year, which a multi-day meeting
      // can outlive — take both parts from this date.
      const year = currentDate.getFullYear();
      const key = `${year}-${monthIndex}`;

      let monthEntry = monthMap.get(key);
      if (!monthEntry) {
        const titleMonth = monthNames[monthIndex] || '';
        monthEntry = {
          id: key,
          title: `${titleMonth} ${year}`.trim(),
          sortKey: formatted.start,
          days: new Map(),
        };
        monthMap.set(key, monthEntry);
      }

      const dayKey = dateEntry.date;

      let dayEntry = monthEntry.days.get(dayKey);
      if (!dayEntry) {
        dayEntry = {
          id: dayKey,
          dateLabel: `${getTranslation({ key: SHORT_WEEKDAY_KEYS[currentDate.getDay()], language: lng })}, ${currentDate.getDate()}`,
          sortKey: dateEntry.date,
          meetings: [],
        };
        monthEntry.days.set(dayKey, dayEntry);
      }
      dayEntry.meetings.push({
        id: `${formatted.uid}-${dayKey}-${index}`,
        time: formatted.time,
        group: fieldServiceMeetingLabel(formatted, (key) =>
          getTranslation({ key, language: lng })
        ),
        ...fieldServiceMeetingLocationLabel(formatted, (key) =>
          getTranslation({ key, language: lng })
        ),
        note: formatted.additionalInfo?.trim() || undefined,
        conductor: formatted.conductor ?? '',
        sortKey: `${dayKey}-${formatted.start}-${index}`,
      });

      if (formatted.start < monthEntry.sortKey) {
        monthEntry.sortKey = formatted.start;
      }
    });
  });

  return Array.from(monthMap.values())
    .toSorted((first, second) => first.sortKey.localeCompare(second.sortKey))
    .map((month) => ({
      id: month.id,
      title: month.title,
      days: Array.from(month.days.values())
        .toSorted((first, second) =>
          first.sortKey.localeCompare(second.sortKey)
        )
        .map((day) => ({
          id: day.id,
          dateLabel: day.dateLabel,
          meetings: day.meetings
            .toSorted((first, second) =>
              first.sortKey.localeCompare(second.sortKey)
            )
            .map(
              ({ id, time, group, address, addressUrl, conductor, note }) => ({
                id,
                time,
                group,
                address,
                addressUrl,
                conductor,
                note,
              })
            ),
        })),
    }));
};

const useScheduleExport = (
  onClose: ScheduleExportType['onClose'],
  scope: ScheduleExportScope
) => {
  const { t } = useAppTranslation();

  // All meetings (not only upcoming) so past week ranges can be exported too.
  const fieldServiceMeetings = useAtomValue(fieldServiceMeetingsState);
  const referenceDate = useAtomValue(fieldServiceMeetingsWeekRangeState);
  const dataView = useAtomValue(userDataViewState);
  const lng = useAtomValue(JWLangLocaleState);
  const headerName = useAtomValue(headerForScheduleState);
  const congregationName = useAtomValue(congNameState);

  const meetings = useMemo(
    () => filterMeetingsByDataView(fieldServiceMeetings, dataView),
    [fieldServiceMeetings, dataView]
  );

  const [startWeek, setStartWeek] = useState(
    fieldServiceMeetingWeek(referenceDate)
  );
  const [endWeek, setEndWeek] = useState(
    fieldServiceMeetingWeek(referenceDate)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const isStartWeekMissing = startWeek.length === 0;
  const isEndWeekMissing = endWeek.length === 0;
  const isValid =
    !isStartWeekMissing && !isEndWeekMissing && startWeek <= endWeek;

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
      // A group-specific meeting is any meeting tied to a single group.
      return Boolean(meeting.meeting_data.group_id?.length);
    }

    return true;
  };

  const rangeEnd = new Date(endWeek);
  rangeEnd.setDate(rangeEnd.getDate() + 6);
  const endDate = endWeek ? formatDate(rangeEnd, 'yyyy/MM/dd') : '';
  const filterByWeekRange = (meeting: FieldServiceMeetingType) =>
    fieldServiceMeetingOverlapsRange(meeting, startWeek, endDate);
  const availableWeeks = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = new Set([currentYear - 1, currentYear, currentYear + 1]);
    for (const meeting of meetings) {
      for (const date of [
        meeting.meeting_data.start,
        meeting.meeting_data.end,
      ]) {
        const value = new Date(date);
        if (Number.isFinite(value.getTime())) years.add(value.getFullYear());
      }
    }
    const weeks = new Set([startWeek, endWeek].filter(Boolean));
    for (const year of years)
      for (let month = 1; month <= 12; month++)
        for (const week of weeksInMonth(
          `${year}/${String(month).padStart(2, '0')}`
        ))
          weeks.add(week);
    return [...weeks].sort((first, second) => first.localeCompare(second));
  }, [meetings, startWeek, endWeek]);

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

      const months = createTemplateMonths(
        meetingsToExport,
        lng,
        startWeek,
        endDate
      );
      const pdfGroupLabel =
        dataView === 'main'
          ? congregationName
          : headerName || t('tr_groupNameLabel', { lng });

      const blob = await pdf(
        <TemplateFieldServiceMeetings
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
    availableWeeks,
  };
};

export default useScheduleExport;
