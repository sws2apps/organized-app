import { useAppTranslation } from '@hooks/index';
import useSpeakersImportConfig, {
  SpeakerImportDraftType,
} from './useSpeakersImportConfig';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { CongregationIncomingDetailsType } from '@definition/speakers_congregations';
import appDb from '@db/appDb';
import { dbSpeakersCongregationsCreate } from '@services/dexie/speakers_congregations';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { createEmptyCongregation } from '@utils/congregations';
import {
  createEmptySpeaker,
  SpeakerIncomingDetailsType,
} from '@utils/speakers';
import { convertToDatabaseCongregation } from '@utils/congregations';
import { convertToDatabaseSpeaker } from '@utils/speakers';

export type SpeakerImportResult = {
  successCount: number;
  totalCount: number;
  errorReason: string;
  successfullyImported: VisitingSpeakerType[];
};

const useCSVImport = () => {
  const { t } = useAppTranslation();
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const getSpeakerPaths = (): string[] => {
    return SPEAKER_FIELD_META.map((field) => field.key);
  };

  const getSpeakerPathsTranslated = (): string[] => {
    return SPEAKER_FIELD_META.map((field) => t(field.label));
  };

  const detectDelimiter = (csvText: string): string => {
    const { meta } = Papa.parse(csvText, {
      preview: 1,
      delimiter: '',
      skipEmptyLines: 'greedy',
    });
    return meta.delimiter ?? ',';
  };

  type MyRowType = Record<string, string>;

  // Hilfsfunktion: Prüft, ob Zeile 2 nur eine Übersetzung der Header ist
  const checkAndRemoveTranslationRow = (dataRows: Record<string, string>[]) => {
    const translatedPaths = new Set(
      getSpeakerPathsTranslated().map((s) => s.trim().toLowerCase())
    );

    if (dataRows.length > 0) {
      const firstRow = dataRows[0];
      const allInTranslated = Object.values(firstRow).every((col) =>
        translatedPaths.has(String(col).trim().toLowerCase())
      );
      if (allInTranslated) {
        return dataRows.slice(1);
      }
    }
    return dataRows;
  };

  // 1. Parsing für CSV
  const parseCSV = (csvText: string): Record<string, string>[] => {
    const parsed = Papa.parse<MyRowType>(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      delimiter: detectDelimiter(csvText),
      transformHeader: (header) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      console.error('CSV parsing errors:', parsed.errors);
    }

    return parsed.data as Record<string, string>[];
  };

  // 2. Parsing für Excel
  const parseExcel = async (file: File): Promise<Record<string, string>[]> => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // header: 1 → gibt ein Array of Arrays zurück (kein Objekt-Mapping)
      const rawRows = XLSX.utils.sheet_to_json<
        (string | number | boolean | null)[]
      >(worksheet, { header: 1, defval: '' });

      if (rawRows.length < 1) return [];

      const headers = rawRows[0].map((h) => String(h).trim());
      const dataRows = rawRows.slice(1);

      return dataRows.map((row) => {
        const rowObj: Record<string, string> = {};
        headers.forEach((header, index) => {
          rowObj[header] = String(row[index] ?? '');
        });
        return rowObj;
      });
    } catch (err) {
      console.error('Excel parsing error:', err);
      return [];
    }
  };

  // 3. Haupt-Logik: Daten zu Objekten mappen
  const parseFileToSpeakersAndCongs = async (
    fileData: { contents: string | File; type: 'csv' | 'xlsx' },
    selectedFields?: Record<string, boolean>
  ): Promise<{
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
  }> => {
    let dataRows: Record<string, string>[] = [];

    if (fileData.type === 'xlsx' && fileData.contents instanceof File) {
      dataRows = await parseExcel(fileData.contents);
    } else if (typeof fileData.contents === 'string') {
      dataRows = parseCSV(fileData.contents);
    }

    // Die Logik zur Entfernung der Übersetzungszeile anwenden (für BEIDE Formate)
    dataRows = checkAndRemoveTranslationRow(dataRows);

    // Header aus der ersten echten Datenzeile oder aus den Keys (falls vorhanden) ableiten
    const headers = dataRows.length > 0 ? Object.keys(dataRows[0]) : [];

    const headerMapping = headers
      .map((header) => {
        const field = SPEAKER_FIELD_META.find(
          (field) => field.key.toLowerCase() === header.toLowerCase()
        );
        return { header, field };
      })
      .filter((item) =>
        selectedFields && item.field
          ? selectedFields[item.field.key]
          : !!item.field
      );

    const resultSpeakers: SpeakerIncomingDetailsType[] = [];
    const resultCongregations: CongregationIncomingDetailsType[] = [];
    let currentCongregation = createEmptyCongregation();
    currentCongregation.cong_name = 'OwnCongregation';

    for (const row of dataRows) {
      try {
        if (row['congregation.cong_name']) {
          currentCongregation = createEmptyCongregation();
        }

        const speaker = createEmptySpeaker();
        const draft: SpeakerImportDraftType = {
          congregation: currentCongregation,
          speaker: speaker,
        };

        for (const mapping of headerMapping) {
          const value = row[mapping.header];
          if (!value || value.trim() === '') continue;

          try {
            mapping.field?.handler(draft, value);
          } catch (error) {
            console.error(`Error handling field ${mapping.header}:`, error);
          }
        }

        if (!draft.speaker.lastname) continue;

        resultCongregations.push(draft.congregation);
        resultSpeakers.push(draft.speaker);
      } catch (error) {
        console.error('Row parsing error:', row, error);
      }
    }

    return { speakers: resultSpeakers, congregations: resultCongregations };
  };

  const getCSVHeaders = (csvText: string): string[] => {
    const parsed = Papa.parse(csvText, { header: true, preview: 1 });
    return parsed.meta.fields || [];
  };

  // Helper für Excel Headers (wird im UI gebraucht)
  const getExcelHeaders = async (file: File): Promise<string[]> => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json<
        (string | number | boolean | null)[]
      >(worksheet, { header: 1, defval: '' });
      if (rawRows.length > 0) {
        return rawRows[0].map((h) => String(h).trim());
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const addSpeakersToDB = async (data: {
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
  }): Promise<SpeakerImportResult> => {
    let errorReason = '';
    const successfullyImported: VisitingSpeakerType[] = [];

    // HIER WAR DER FEHLER (let statt const)
    let successCount = 0;

    const totalCount = data.speakers.length;
    const errorCounts = new Map<string, number>();

    // Cache für bereits existierende Versammlungen laden
    const existingCongs = await appDb.speakers_congregations.toArray();
    const existingVisitingSpeakers = await appDb.visiting_speakers.toArray();
    const settings = await appDb.app_settings.get(1);

    if (!settings) {
      return {
        successCount: 0,
        totalCount,
        errorReason: 'Settings not found',
        successfullyImported: [],
      };
    }

    const ownCongName = settings.cong_settings.cong_name;

    const congMap = new Map<string, string>();
    existingCongs.forEach((c) => {
      const key = `${c.cong_data.cong_name.value}`;
      if (!c._deleted.value) congMap.set(key, c.id);
    });

    const existingSpeakerKeys = new Set(
      existingVisitingSpeakers.map(
        (s) =>
          `${s.speaker_data.cong_id}|${s.speaker_data.person_firstname.value}|${s.speaker_data.person_lastname.value}`
      )
    );

    for (let i = 0; i < data.speakers.length; i++) {
      const speaker = data.speakers[i];
      const congregation = data.congregations[i];
      congregation.cong_name =
        congregation.cong_name === 'OwnCongregation'
          ? ownCongName
          : congregation.cong_name;

      try {
        const congKey = `${congregation.cong_name}`;
        let finalCongId = congMap.get(congKey);

        if (finalCongId) {
          const existingCong = existingCongs.find((c) => c.id === finalCongId);

          // HIER WAR DER BEKANNTE CONG_ID FEHLER (mit .value korrigiert)
          const isSynced =
            existingCong?.cong_data?.cong_id &&
            existingCong.cong_data.cong_id.length > 0;

          if (isSynced) {
            const errorMsg = t('tr_congregationAlreadySynced');
            errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
            continue;
          }
        }

        if (!finalCongId) {
          const newCong = convertToDatabaseCongregation(congregation);
          await dbSpeakersCongregationsCreate(newCong);
          finalCongId = newCong.id;
          congMap.set(congKey, finalCongId);
        }

        const speakerKey = `${finalCongId}|${speaker.firstname}|${speaker.lastname}`;
        if (existingSpeakerKeys.has(speakerKey)) {
          const errorMsg = t('tr_speakerAlreadyExists');
          errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
          continue;
        }

        const finalSpeaker = convertToDatabaseSpeaker(speaker, finalCongId);

        await appDb.visiting_speakers.put(finalSpeaker);

        successfullyImported.push(finalSpeaker);
        successCount++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
      }
    }

    const errorMessages = Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([message, count]) => `${count} x ${message}`);

    errorReason = errorMessages.join('. ');

    return { successCount, totalCount, errorReason, successfullyImported };
  };

  return {
    detectDelimiter,
    getCSVHeaders,
    getExcelHeaders,
    getSpeakerPaths,
    getSpeakerPathsTranslated,
    parseFileToSpeakersAndCongs,
    addSpeakersToDB,
  };
};

export default useCSVImport;
