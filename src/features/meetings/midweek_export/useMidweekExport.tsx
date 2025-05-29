import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { Week } from '@definition/week_type';
import { MidweekExportType, PDFBlobType } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAtom, useAtomValue } from 'jotai';
import {
  S140TemplateState,
  S89TemplateState,
  schedulesState,
} from '@states/schedules';
import {
  MidweekMeetingDataType,
  S140TemplateType,
  S89DataType,
  S89TemplateType,
  SchedWeekType,
} from '@definition/schedules';
import {
  schedulesMidweekData,
  schedulesS89Data,
} from '@services/app/schedules';
import {
  displayNameMeetingsEnableState,
  JWLangLocaleState,
  JWLangState,
  meetingExactDateState,
  midweekMeetingClassCountState,
  midweekMeetingWeekdayState,
  userDataViewState,
} from '@states/settings';
import {
  TemplateS140,
  TemplateS140AppNormal,
  TemplateS89,
  TemplateS89Doc4in1,
} from '@views/index';
import { cookiesConsentState } from '@states/app';
import { addDays, isMondayDate } from '@utils/date';
import { formatDate } from '@services/dateformat';
import { headerForScheduleState } from '@states/field_service_groups';
import { WEEK_TYPE_NO_MEETING } from '@constants/index';

const useMidweekExport = (onClose: MidweekExportType['onClose']) => {
  const [S89Template, setS89Template] = useAtom(S89TemplateState);
  const [S140Template, setS140Template] = useAtom(S140TemplateState);

  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);
  const class_count = useAtomValue(midweekMeetingClassCountState);
  const cong_name = useAtomValue(headerForScheduleState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const cookiesConsent = useAtomValue(cookiesConsentState);
  const sourceLocale = useAtomValue(JWLangLocaleState);
  const meetingExactDate = useAtomValue(meetingExactDateState);
  const midweekDay = useAtomValue(midweekMeetingWeekdayState);

  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportS140, setExportS140] = useState(false);
  const [exportS89, setExportS89] = useState(false);

  const handleSetStartMonth = (value: string) => setStartMonth(value);

  const handleSetEndMonth = (value: string) => setEndMonth(value);

  const handleToggleS140 = () => setExportS140((prev) => !prev);

  const handleToggleS89 = () => setExportS89((prev) => !prev);

  const handleSelectS89Template = (template: S89TemplateType) => {
    setS89Template(template);

    if (cookiesConsent) {
      localStorage.setItem('organized_template_S89', template);
    }
  };

  const handleSelectS140Template = (template: S140TemplateType) => {
    setS140Template(template);

    if (cookiesConsent) {
      localStorage.setItem('organized_template_S140', template);
    }
  };

  const handleExportS89 = async (weeks: SchedWeekType[]) => {
    const S89: S89DataType[] = [];

    for (const schedule of weeks) {
      const data = schedulesS89Data(schedule, dataView);
      S89.push(...data);
    }

    if (S89.length > 0) {
      const firstWeek = S89.at(0).weekOf.replaceAll('/', '');
      const lastWeek = S89.at(-1).weekOf.replaceAll('/', '');

      if (S89Template === 'S89_4x1') {
        const blob = await pdf(
          <TemplateS89Doc4in1 s89Data={S89} lang={sourceLocale} />
        ).toBlob();

        const filename = `S-89_${firstWeek}-${lastWeek}.pdf`;

        saveAs(blob, filename);
      }

      if (S89Template === 'S89_1x1') {
        const pdfBlobs: PDFBlobType[] = [];

        for await (const data of S89) {
          const blob = await pdf(
            <TemplateS89 data={data} lang={sourceLocale} />
          ).toBlob();

          let filename = 'S-89_';
          filename += data.weekOf.replaceAll('/', '') + '_';
          filename += data.student_name.replace(' ', '_') + '.pdf';

          pdfBlobs.push({ pdfBlob: blob, filename });
        }

        const zip = new JSZip();

        pdfBlobs.forEach((blob) => {
          zip.file(blob.filename, blob.pdfBlob);
        });

        const content = await zip.generateAsync({ type: 'blob' });

        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `S-89_${firstWeek}-${lastWeek}.zip`;
        link.click();
      }
    }
  };

  const handleExportS140 = async (weeks: SchedWeekType[]) => {
    const S140: MidweekMeetingDataType[] = [];

    for (const schedule of weeks) {
      if (dataView !== 'main') {
        const weekType =
          schedule.midweek_meeting.week_type.find(
            (record) => record.type === dataView
          )?.value ?? Week.NORMAL;

        const noMeeting = WEEK_TYPE_NO_MEETING.includes(weekType);

        if (noMeeting) continue;
      }

      const data = schedulesMidweekData(schedule, dataView, lang);
      S140.push(data);
    }

    if (S140.length > 0) {
      const blob = await pdf(
        S140Template === 'S140_default' ? (
          <TemplateS140
            class_count={class_count}
            cong_name={cong_name}
            data={S140}
            lang={sourceLocale}
          />
        ) : (
          <TemplateS140AppNormal
            class_count={class_count}
            cong_name={cong_name}
            data={S140}
            fullname={!displayNameEnabled}
            lang={sourceLocale}
          />
        )
      ).toBlob();

      const toAdd = meetingExactDate ? midweekDay - 1 : 0;

      const firstWeek = formatDate(
        addDays(S140.at(0).weekOf, toAdd),
        'yyyyMMdd'
      );

      const lastWeek = formatDate(
        addDays(S140.at(-1).weekOf, toAdd),
        'yyyyMMdd'
      );

      const filename = `MM_${firstWeek}-${lastWeek}.pdf`;

      saveAs(blob, filename);
    }
  };

  const handleExportSchedule = async () => {
    if (isProcessing) return;
    if (startMonth.length === 0 || endMonth.length === 0) return;
    if (!exportS140 && !exportS89) return;

    try {
      setIsProcessing(true);

      // get affected weeks list
      const weeksList = schedules.filter((schedule) => {
        const isMonday = isMondayDate(schedule.weekOf);
        if (!isMonday) return false;

        const [yearStart, monthStart] = startMonth.split('/');
        const [yearEnd, monthEnd] = endMonth.split('/');

        const toAdd = meetingExactDate ? midweekDay - 1 : 0;

        const meetingDate = addDays(schedule.weekOf, toAdd);

        const yearCurrent = String(meetingDate.getFullYear());
        const monthCurrent = String(meetingDate.getMonth() + 1).padStart(
          2,
          '0'
        );

        return (
          yearCurrent >= yearStart &&
          yearCurrent <= yearEnd &&
          monthCurrent >= monthStart &&
          monthCurrent <= monthEnd
        );
      });

      if (exportS89) {
        await handleExportS89(weeksList);
      }

      if (exportS140) {
        await handleExportS140(weeksList);
      }

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    handleSetStartMonth,
    handleSetEndMonth,
    isProcessing,
    handleExportSchedule,
    exportS140,
    exportS89,
    handleToggleS140,
    handleToggleS89,
    S89Template,
    handleSelectS89Template,
    S140Template,
    handleSelectS140Template,
  };
};

export default useMidweekExport;
