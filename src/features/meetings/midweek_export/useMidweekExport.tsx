import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useAppTranslation } from '@hooks/index';
import { MidweekExportType, PDFBlobType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import {
  MidweekMeetingDataType,
  S89DataType,
  SchedWeekType,
} from '@definition/schedules';
import {
  schedulesMidweekData,
  schedulesS89Data,
} from '@services/app/schedules';
import {
  congNameState,
  congNumberState,
  displayNameEnableState,
  midweekMeetingClassCountState,
  userDataViewState,
} from '@states/settings';
import {
  TemplateS140,
  TemplateS140AppNormal,
  TemplateS89,
  TemplateS89Doc4in1,
} from '@views/index';
import { JWLangState } from '@states/app';
import { S140TemplateType } from './S140TemplateSelector/index.types';
import { S89TemplateType } from './S89TemplateSelector/index.types';

const useMidweekExport = (onClose: MidweekExportType['onClose']) => {
  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);
  const class_count = useRecoilValue(midweekMeetingClassCountState);
  const cong_name = useRecoilValue(congNameState);
  const cong_number = useRecoilValue(congNumberState);
  const displayNameEnabled = useRecoilValue(displayNameEnableState);

  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportS140, setExportS140] = useState(false);
  const [exportS89, setExportS89] = useState(false);
  const [S89Template, setS89Template] = useState<S89TemplateType>('S89_1x1');
  const [S140Template, setS140Template] =
    useState<S140TemplateType>('S140_default');

  const handleSetStartMonth = (value: string) => setStartMonth(value);

  const handleSetEndMonth = (value: string) => setEndMonth(value);

  const handleToggleS140 = () => setExportS140((prev) => !prev);

  const handleToggleS89 = () => setExportS89((prev) => !prev);

  const handleSelectS89Template = (template: S89TemplateType) => {
    setS89Template(template);
  };

  const handleSelectS140Template = (template: S140TemplateType) => {
    setS140Template(template);
  };

  const handleExportS89 = async (weeks: SchedWeekType[]) => {
    const S89: S89DataType[] = [];

    for await (const schedule of weeks) {
      const data = await schedulesS89Data(schedule, dataView);
      S89.push(...data);
    }

    if (S89.length > 0) {
      const firstWeek = S89.at(0).weekOf.replaceAll('/', '');
      const lastWeek = S89.at(-1).weekOf.replaceAll('/', '');

      if (S89Template === 'S89_4x1') {
        const blob = await pdf(
          <TemplateS89Doc4in1 s89Data={S89} lang={lang} />
        ).toBlob();

        const filename = `S-89_${firstWeek}-${lastWeek}.pdf`;

        saveAs(blob, filename);
      }

      if (S89Template === 'S89_1x1') {
        const pdfBlobs: PDFBlobType[] = [];

        for await (const data of S89) {
          const blob = await pdf(
            <TemplateS89 data={data} lang={lang} />
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

    for await (const schedule of weeks) {
      const data = await schedulesMidweekData(schedule, dataView, lang);
      S140.push(data);
    }

    if (S140.length > 0) {
      const blob = await pdf(
        S140Template === 'S140_default' ? (
          <TemplateS140
            class_count={class_count}
            cong_name={cong_name}
            cong_number={cong_number}
            data={S140}
          />
        ) : (
          <TemplateS140AppNormal
            class_count={class_count}
            cong_name={cong_name}
            cong_number={cong_number}
            data={S140}
            fullname={!displayNameEnabled}
          />
        )
      ).toBlob();

      const firstWeek = S140.at(0).weekOf.replaceAll('/', '');
      const lastWeek = S140.at(-1).weekOf.replaceAll('/', '');

      const filename = `MM_${firstWeek}-${lastWeek}.pdf`;

      saveAs(blob, filename);
    }
  };

  const handleExportSchedule = async () => {
    if (startMonth.length === 0 || endMonth.length === 0) return;
    if (!exportS140 && !exportS89) return;

    try {
      setIsProcessing(true);

      // get affected weeks list
      const weeksList = schedules.filter((schedule) => {
        const [yearStart, monthStart] = startMonth.split('/');
        const [yearEnd, monthEnd] = endMonth.split('/');

        const [yearCurrent, monthCurrent] = schedule.weekOf.split('/');

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

      await displaySnackNotification({
        header: t('tr_errorTitle'),
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
