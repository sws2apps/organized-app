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

type ExportFormat = 'xlsx' | 'csv';

const useExportSpeakers = () => {
  const { t } = useAppTranslation();
  const lng = useAtomValue(JWLangLocaleState);
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const [isProcessing, setIsProcessing] = useState(false);

  // Extrahiere Speaker-Werte
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

  // Extrahiere Congregation-Werte
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

  // Formatiere Talks zurück ins Import-Format: "1 (10, 5), 2, 145"
  const formatTalks = (speaker: VisitingSpeakerType): string => {
    const talks = speaker.speaker_data.talks
      .filter((talk) => !talk._deleted)
      .map((talk) => {
        const talkNumber = talk.talk_number;
        const songs = talk.talk_songs.filter((song) => song > 0);

        if (songs.length > 0) {
          return `${talkNumber} (${songs.join(', ')})`;
        }
        return String(talkNumber);
      });

    return talks.join(', ');
  };

  const handleExport = async (format: ExportFormat = 'xlsx'): Promise<void> => {
    try {
      setIsProcessing(true);

      // Lade alle Speaker und ihre Congregations
      const speakers = await appDb.visiting_speakers.toArray();
      const congregations = await appDb.speakers_congregations.toArray();

      // Filter: Nur nicht-gelöschte Speaker
      const activeSpeakers = speakers.filter((s) => !s._deleted.value);

      // Erstelle Map für schnellen Congregation-Zugriff
      const congMap = new Map<string, SpeakersCongregationsType>(
        congregations.filter((c) => !c._deleted.value).map((c) => [c.id, c])
      );

      // Header-Zeile 1: Keys (wie Import erwartet)
      const headerKeys = SPEAKER_FIELD_META.map((field) => field.key);

      // Header-Zeile 2: Übersetzte Labels
      const headerLabels = SPEAKER_FIELD_META.map((field) =>
        t(field.label, { lng })
      );

      // Datenzeilen erstellen
      const dataRows: string[][] = activeSpeakers.map((speaker) => {
        const congId = speaker.speaker_data.cong_id;
        const congregation = congMap.get(congId);

        return SPEAKER_FIELD_META.map((field) => {
          if (field.key.startsWith('speaker.')) {
            return getSpeakerValue(speaker, field.key);
          } else if (field.key.startsWith('congregation.')) {
            return getCongregationValue(congregation, field.key);
          }
          return '';
        });
      });

      if (format === 'xlsx') {
        await exportAsExcel(headerKeys, headerLabels, dataRows);
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
    dataRows: string[][]
  ): Promise<void> => {
    const data: SheetData = [];

    // Header Row 1: Keys
    const keyRow: Row = headerKeys.map((key) => ({
      value: key,
      fontWeight: 'bold' as const,
      backgroundColor: '#f0f0f0',
    }));
    data.push(keyRow);

    // Header Row 2: Translated Labels
    const labelRow: Row = headerLabels.map((label) => ({
      value: label,
      fontWeight: 'bold' as const,
      backgroundColor: '#e8e8e8',
    }));
    data.push(labelRow);

    // Data Rows
    const rows: Row[] = dataRows.map((row) =>
      row.map((value) => ({ value, type: String }))
    );
    data.push(...rows);

    // Spaltenbreiten: Spezifisch je nach Feldtyp
    const columns = SPEAKER_FIELD_META.map((field) => {
      // Breitere Spalten für bestimmte Felder
      if (field.key.includes('email')) return { width: 30 };
      if (field.key.includes('address')) return { width: 40 };
      if (field.key.includes('talks')) return { width: 35 };
      if (field.key.includes('name')) return { width: 25 };
      if (field.key.includes('phone')) return { width: 20 };
      return { width: 15 }; // Standard
    });

    await writeXlsxFile(data, {
      fileName: 'speakers-export.xlsx',
      stickyRowsCount: 2, // Beide Header-Zeilen fixieren
      columns,
    });
  };

  const exportAsCSV = async (
    headerKeys: string[],
    headerLabels: string[],
    dataRows: string[][]
  ): Promise<void> => {
    // CSV mit beiden Header-Zeilen
    const csvData: string[][] = [headerKeys, headerLabels, ...dataRows];

    const csv = Papa.unparse(csvData, {
      delimiter: ',',
      newline: '\n',
      quotes: true, // Alle Felder in Anführungszeichen
      header: false, // Wir haben bereits eigene Header
    });

    // Download triggern
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'speakers-export.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    URL.revokeObjectURL(url);
  };

  return {
    handleExport,
    isProcessing,
    fileNameXlsx: 'speakers-export.xlsx' as const,
    fileNameCsv: 'speakers-export.csv' as const,
  };
};

export default useExportSpeakers;
