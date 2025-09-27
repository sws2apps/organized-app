import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import writeXlsxFile, { Row, SheetData } from 'write-excel-file';
import { IconInfo } from '@components/icons';
import {
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
  FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS,
  FieldServiceMeetingCategory,
  FieldServiceMeetingType,
} from '@definition/field_service_meetings';
import { ScheduleExportScope, ScheduleExportType } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import { fieldServiceMeetingsActiveState } from '@states/field_service_meetings';
import { fieldServiceMeetingData } from '@services/app/field_service_meetings';
import { JWLangLocaleState, userDataViewState } from '@states/settings';
import { formatDate, getWeekDate } from '@utils/date';

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

const useScheduleExport = (
  onClose: ScheduleExportType['onClose'],
  scope: ScheduleExportScope
) => {
  const { t } = useAppTranslation();

  const fieldServiceMeetings = useAtomValue(fieldServiceMeetingsActiveState);
  const dataView = useAtomValue(userDataViewState);
  const lng = useAtomValue(JWLangLocaleState);

  const meetings = useMemo(
    () => filterMeetingsByDataView(fieldServiceMeetings, dataView),
    [fieldServiceMeetings, dataView]
  );

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

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
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      const meetingsToExport = meetings
        .filter(filterByScope)
        .filter(filterByWeekRange)
        .toSorted(
          (first, second) =>
            new Date(first.meeting_data.start).getTime() -
            new Date(second.meeting_data.start).getTime()
        );

      if (meetingsToExport.length === 0) {
        setIsProcessing(false);

        displaySnackNotification({
          header: t('tr_noFieldServiceMeetings'),
          message: t('tr_noFieldServiceMeetingsForRange'),
          severity: 'message-with-button',
          icon: <IconInfo color="var(--accent-main)" />,
        });

        return;
      }

      const sheetData: SheetData = [];

      const headerRow: Row = [
        { value: t('tr_date', { lng }), fontWeight: 'bold' },
        { value: t('tr_timerLabelTime', { lng }), fontWeight: 'bold' },
        { value: t('tr_title', { lng }), fontWeight: 'bold' },
        { value: t('tr_group', { lng }), fontWeight: 'bold' },
        { value: t('tr_conductor', { lng }), fontWeight: 'bold' },
        { value: t('tr_location', { lng }), fontWeight: 'bold' },
        { value: t('tr_address', { lng }), fontWeight: 'bold' },
        { value: t('tr_joinInfo', { lng }), fontWeight: 'bold' },
      ];

      sheetData.push(headerRow);

      for (const meeting of meetingsToExport) {
        const formatted = fieldServiceMeetingData(meeting);

        const dateLabel =
          formatted.datesRange && formatted.datesRange.length > 0
            ? formatted.datesRange
            : formatted.dates.map((date) => date.dateFormatted).join(', ') ||
              formatted.date;

        const title = t(
          FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[
            meeting.meeting_data.category
          ],
          { lng }
        );

        const location = t(
          FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS[formatted.location],
          { lng }
        );

        const row: Row = [
          { value: dateLabel },
          { value: formatted.time },
          { value: title },
          { value: formatted.groupName ?? '' },
          { value: formatted.conductor ?? '' },
          { value: location },
          { value: formatted.address ?? '' },
          { value: formatted.additionalInfo ?? '' },
        ];

        sheetData.push(row);
      }

      await writeXlsxFile(sheetData, {
        fileName: `field-service-meetings-${startWeek.replaceAll('/', '')}-${endWeek.replaceAll('/', '')}.xlsx`,
        stickyRowsCount: 1,
        columns: [
          { width: 35 },
          { width: 18 },
          { width: 40 },
          { width: 30 },
          { width: 30 },
          { width: 25 },
          { width: 45 },
          { width: 45 },
        ],
      });

      displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_fieldServiceMeetingExportSuccess'),
        severity: 'success',
      });

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
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
    }
  };

  return {
    handleSetStartWeek,
    handleSetEndWeek,
    isProcessing,
    handleExportSchedule,
  };
};

export default useScheduleExport;
