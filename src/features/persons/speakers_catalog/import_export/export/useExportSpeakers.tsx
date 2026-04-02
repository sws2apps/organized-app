// useExportSpeakers.tsx
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import writeXlsxFile, { Row, SheetData } from 'write-excel-file';
import Papa from 'papaparse';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { JWLangLocaleState } from '@states/settings';
import useSpeakersImportConfig from '../confirm_import/useSpeakersImportConfig';
import appDb from '@db/appDb';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import {
  getCSVDelimiterByNumberFormat,
  arrayInCsvSeparator,
} from '@utils/csvFiles';

type ExportFormat = 'xlsx' | 'csv';

const useExportSpeakers = () => {
  const { t } = useAppTranslation();
  const lng = useAtomValue(JWLangLocaleState);
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const [isProcessing, setIsProcessing] = useState(false);

  const getSpeakerValue = (
    speaker: VisitingSpeakerType,
    field: string
  ): string => {
    switch (field) {
      case 'speaker.firstname':
        return speaker.speaker_data.person_firstname.value;
      case 'speaker.lastname':
        return speaker.speaker_data.person_lastname.value;
      case 'speaker.email':
        return speaker.speaker_data.person_email?.value || '';
      case 'speaker.phone':
        return speaker.speaker_data.person_phone?.value || '';
      case 'speaker.is_elder':
        return speaker.speaker_data.elder.value ? 'yes' : '';
      case 'speaker.is_ms':
        return speaker.speaker_data.ministerial_servant.value ? 'yes' : '';
      case 'speaker.talks':
        return formatTalks(speaker);
      default:
        return '';
    }
  };

  const getCongregationValue = (
    congregation: SpeakersCongregationsType | undefined,
    field: string
  ): string => {
    if (!congregation) return '';

    switch (field) {
      case 'congregation.cong_name':
        return congregation.cong_data.cong_name.value;
      case 'congregation.cong_number':
        return congregation.cong_data.cong_number.value;
      case 'congregation.cong_location.address':
        return congregation.cong_data.cong_location.address.value;
      case 'congregation.midweek_meeting.time':
        return congregation.cong_data.midweek_meeting.time.value;
      case 'congregation.midweek_meeting.weekday':
        return String(congregation.cong_data.midweek_meeting.weekday.value);
      case 'congregation.weekend_meeting.time':
        return congregation.cong_data.weekend_meeting.time.value;
      case 'congregation.weekend_meeting.weekday':
        return String(congregation.cong_data.weekend_meeting.weekday.value);
      case 'congregation.coordinator.name':
        return congregation.cong_data.coordinator.name.value;
      case 'congregation.coordinator.email':
        return congregation.cong_data.coordinator.email.value;
      case 'congregation.coordinator.phone':
        return congregation.cong_data.coordinator.phone.value;
      case 'congregation.public_talk_coordinator.name':
        return congregation.cong_data.public_talk_coordinator.name.value;
      case 'congregation.public_talk_coordinator.email':
        return congregation.cong_data.public_talk_coordinator.email.value;
      case 'congregation.public_talk_coordinator.phone':
        return congregation.cong_data.public_talk_coordinator.phone.value;
      default:
        return '';
    }
  };

  // Formatiere Talks ins Import-Format und berücksichtige das Listentrennzeichen
  const formatTalks = (speaker: VisitingSpeakerType): string => {
    const listSeparator = arrayInCsvSeparator();

    const talks = speaker.speaker_data.talks
      .filter((talk) => !talk._deleted)
      .map((talk) => {
        const talkNumber = talk.talk_number;
        const songs = talk.talk_songs.filter((song) => song > 0);

        if (songs.length > 0) {
          return `${talkNumber} (${songs.join(`${listSeparator} `)})`;
        }
        return String(talkNumber);
      });

    return talks.join(`${listSeparator} `);
  };

  // WICHTIG: Nimmt nun die selektierten Felder als zweiten Parameter entgegen!
  const handleExport = async (
    format: ExportFormat = 'xlsx',
    selectedFields: Record<string, boolean>
  ): Promise<void> => {
    try {
      setIsProcessing(true);

      const speakers = await appDb.visiting_speakers.toArray();
      const congregations = await appDb.speakers_congregations.toArray();

      const activeSpeakers = speakers.filter((s) => !s._deleted.value);

      const congMap = new Map<string, SpeakersCongregationsType>(
        congregations.filter((c) => !c._deleted.value).map((c) => [c.id, c])
      );

      // 1. Filtere SPEAKER_FIELD_META anhand der Checkboxen
      const exportFields = SPEAKER_FIELD_META.filter(
        (field) => selectedFields[field.key]
      );

      // 2. Nutze nur noch exportFields
      const headerKeys = exportFields.map((field) => field.key);
      const headerLabels = exportFields.map((field) => t(field.label, { lng }));

      // 3. Nur die Daten für markierte Felder sammeln
      const dataRows: string[][] = activeSpeakers.map((speaker) => {
        const congId = speaker.speaker_data.cong_id;
        const congregation = congMap.get(congId);

        return exportFields.map((field) => {
          if (field.key.startsWith('speaker.')) {
            return getSpeakerValue(speaker, field.key);
          } else if (field.key.startsWith('congregation.')) {
            return getCongregationValue(congregation, field.key);
          }
          return '';
        });
      });

      if (format === 'xlsx') {
        await exportAsExcel(headerKeys, headerLabels, dataRows, exportFields);
      } else {
        await exportAsCSV(headerKeys, headerLabels, dataRows);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: errorMessage,
        severity: 'error',
        icon: <IconError />,
      });
    }
  };

  const exportAsExcel = async (
    headerKeys: string[],
    headerLabels: string[],
    dataRows: string[][],
    exportFields: typeof SPEAKER_FIELD_META
  ): Promise<void> => {
    const data: SheetData = [];

    const keyRow: Row = headerKeys.map((key) => ({
      value: key,
      fontWeight: 'bold' as const,
      backgroundColor: '#f0f0f0',
    }));
    data.push(keyRow);

    const labelRow: Row = headerLabels.map((label) => ({
      value: label,
      fontWeight: 'bold' as const,
      backgroundColor: '#e8e8e8',
    }));
    data.push(labelRow);

    const rows: Row[] = dataRows.map((row) =>
      row.map((value) => ({ value, type: String }))
    );
    data.push(...rows);

    const columns = exportFields.map((field) => {
      if (field.key.includes('email')) return { width: 30 };
      if (field.key.includes('address')) return { width: 40 };
      if (field.key.includes('talks')) return { width: 35 };
      if (field.key.includes('name')) return { width: 25 };
      if (field.key.includes('phone')) return { width: 20 };
      return { width: 15 };
    });

    await writeXlsxFile(data, {
      fileName: 'speakers-export.xlsx',
      stickyRowsCount: 2,
      columns,
    });
  };

  const exportAsCSV = async (
    headerKeys: string[],
    headerLabels: string[],
    dataRows: string[][]
  ): Promise<void> => {
    const csvData: string[][] = [headerKeys, headerLabels, ...dataRows];
    const delimiter = getCSVDelimiterByNumberFormat();

    const csv = Papa.unparse(csvData, {
      delimiter: delimiter,
      newline: '\n',
      quotes: true,
      header: false,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'speakers-export.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const fileNameXlsx = 'speakers-export.xlsx';
  const fileNameCsv = 'speakers-export.csv';

  return { fileNameXlsx, fileNameCsv, isProcessing, handleExport };
};

export default useExportSpeakers;
