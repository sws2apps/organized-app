// src/features/persons/speakers_catalog/import_export/export/useExportSpeakers.tsx
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import { SettingsType } from '@definition/settings';
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
    settings: SettingsType | undefined,
    isOwnCongregation: boolean,
    field: string
  ): string => {
    // If it's the own congregation, fetch data from settings
    if (isOwnCongregation && settings) {
      switch (field) {
        case 'congregation.cong_name':
          // Fallback to name from congregation object if settings is empty
          return (
            settings.cong_settings.cong_name ||
            congregation?.cong_data.cong_name.value ||
            ''
          );

        case 'congregation.cong_number':
          return settings.cong_settings.cong_number.value;

        case 'congregation.cong_location.address':
          return settings.cong_settings.cong_location?.address || '';

        case 'congregation.midweek_meeting.time':
          return settings.cong_settings.midweek_meeting[0]?.time?.value || '';

        case 'congregation.midweek_meeting.weekday':
          return String(
            settings.cong_settings.midweek_meeting[0]?.weekday?.value || ''
          );

        case 'congregation.weekend_meeting.time':
          return settings.cong_settings.weekend_meeting[0]?.time?.value || '';

        case 'congregation.weekend_meeting.weekday':
          return String(
            settings.cong_settings.weekend_meeting[0]?.weekday?.value || ''
          );

        // Coordinators for the own congregation are usually in the user profile or elsewhere,
        // we can return empty strings here if they don't exist in settings.
        default:
          return '';
      }
    }

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

  const handleExport = async (
    format: ExportFormat = 'xlsx',
    selectedFields: Record<string, boolean>
  ): Promise<void> => {
    try {
      setIsProcessing(true);

      const speakers = await appDb.visiting_speakers.toArray();
      const congregations = await appDb.speakers_congregations.toArray();
      const settings = await appDb.app_settings.get(1);

      // Get own cong ID from settings
      const myCongId = settings?.cong_settings.cong_id;

      // Collect all valid external congregation IDs
      const activeCongregations = congregations.filter(
        (c) => !c._deleted.value
      );
      const congMap = new Map(activeCongregations.map((c) => [c.id, c]));

      // ONLY consider speakers who are not deleted AND
      // whose cong_id either matches the own one or exists in congMap
      const activeSpeakers = speakers.filter((s) => {
        if (s._deleted.value) return false;

        const congId = s.speaker_data.cong_id;
        return congId === myCongId || congMap.has(congId);
      });

      activeSpeakers.sort((a, b) => {
        const congA = a.speaker_data.cong_id || '';
        const congB = b.speaker_data.cong_id || '';
        if (congA !== congB) return congA.localeCompare(congB);

        const nameA = a.speaker_data.person_lastname.value;
        const nameB = b.speaker_data.person_lastname.value;
        return nameA.localeCompare(nameB);
      });

      const exportFields = SPEAKER_FIELD_META.filter(
        (field) => selectedFields[field.key]
      );

      const headerKeys = exportFields.map((field) => field.key);
      const headerLabels = exportFields.map((field) => t(field.label, { lng }));

      const dataRows: string[][] = activeSpeakers.map((speaker) => {
        const congId = speaker.speaker_data.cong_id;
        const congregation = congMap.get(congId);

        // Safely check if it is the own congregation
        const isOwnCongregation = congId === myCongId;

        return exportFields.map((field) => {
          if (field.key.startsWith('speaker.')) {
            return getSpeakerValue(speaker, field.key);
          } else if (field.key.startsWith('congregation.')) {
            return getCongregationValue(
              congregation,
              settings,
              isOwnCongregation,
              field.key
            );
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
    } catch (error: unknown) {
      console.error(error);
      setIsProcessing(false);

      const errorMessage =
        error instanceof Error ? error.message : String(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: errorMessage,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });

      // IMPORTANT: Rethrow error so the dialog knows NOT to close
      throw error;
    }
  };

  const exportAsExcel = async (
    headerKeys: string[],
    headerLabels: string[],
    dataRows: string[][],
    exportFields: typeof SPEAKER_FIELD_META
  ): Promise<void> => {
    const excelData: string[][] = [headerKeys, headerLabels, ...dataRows];

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    const columns = exportFields.map((field) => {
      if (field.key.includes('email')) return { wch: 30 };
      if (field.key.includes('address')) return { wch: 40 };
      if (field.key.includes('talks')) return { wch: 35 };
      if (field.key.includes('name')) return { wch: 25 };
      if (field.key.includes('phone')) return { wch: 20 };
      return { wch: 15 };
    });
    worksheet['!cols'] = columns;

    worksheet['!views'] = [
      {
        state: 'frozen',
        ySplit: 2,
        activePane: 'bottomLeft',
      },
    ];

    if (worksheet['!ref']) {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let R = 0; R <= 1; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[address]) continue;
          worksheet[address].s = { font: { bold: true } };
        }
      }
    }

    if (dataRows.length > 0) {
      const lastColumn = XLSX.utils.encode_col(headerKeys.length - 1);
      const lastRow = dataRows.length + 2;
      worksheet['!autofilter'] = {
        ref: `A2:${lastColumn}${lastRow}`,
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Speakers');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'speakers-export.xlsx');
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

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
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
