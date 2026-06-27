// src/features/persons/speakers_catalog/import_export/confirm_import/useCSVImport.tsx
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

type RowData = Record<string, string>;

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
    const { meta } = Papa.parse<RowData>(csvText, {
      preview: 1,
      delimiter: '',
      skipEmptyLines: 'greedy',
    });
    return meta.delimiter ?? ',';
  };

  const checkAndRemoveTranslationRow = (dataRows: RowData[]): RowData[] => {
    if (dataRows.length === 0) return dataRows;

    const translatedPaths = new Set(
      getSpeakerPathsTranslated().map((s) => s.trim().toLowerCase())
    );

    const firstRow = dataRows[0];
    const columns = Object.values(firstRow)
      .map((col) => String(col).trim().toLowerCase())
      .filter((col) => col !== '');

    if (columns.length === 0) return dataRows;

    // We count how many cells in the first row match known translations
    const matchesCount = columns.filter((col) =>
      translatedPaths.has(col)
    ).length;

    // Scoring: If more than 30% of the filled columns match our translation labels,
    // or if at least 3 translations were clearly found,
    // we assume that this is our generated translation row.
    // A real speaker would hardly be named exactly "First Name" and "Last Name" by chance.
    const isTranslationRow =
      matchesCount / columns.length > 0.3 || matchesCount >= 3;

    if (isTranslationRow) {
      return dataRows.slice(1);
    }

    return dataRows;
  };

  const parseCSV = (csvText: string): RowData[] => {
    const parsed = Papa.parse<RowData>(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      delimiter: detectDelimiter(csvText),
      transformHeader: (header: string) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      console.error('CSV parsing errors:', parsed.errors);
    }

    return parsed.data;
  };

  const parseExcel = async (file: File): Promise<RowData[]> => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rawRows = XLSX.utils.sheet_to_json<
        (string | number | boolean | null)[]
      >(worksheet, {
        header: 1,
        defval: '',
      });

      if (rawRows.length < 1) return [];

      const headers = rawRows[0].map((h) => String(h).trim());
      const dataRows = rawRows.slice(1);

      return dataRows.map((row) => {
        const rowObj: RowData = {};
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

  const parseFileToSpeakersAndCongs = async (
    fileData: { contents: string | File; type: 'csv' | 'xlsx' },
    selectedFields?: Record<string, boolean>
  ): Promise<{
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
  }> => {
    let dataRows: RowData[] = [];

    if (fileData.type === 'xlsx' && fileData.contents instanceof File) {
      dataRows = await parseExcel(fileData.contents);
    } else if (typeof fileData.contents === 'string') {
      dataRows = parseCSV(fileData.contents);
    }

    dataRows = checkAndRemoveTranslationRow(dataRows);

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
    const parsed = Papa.parse<RowData>(csvText, {
      header: true,
      preview: 1,
      delimiter: detectDelimiter(csvText),
      skipEmptyLines: 'greedy',
      transformHeader: (header: string) => header.trim(),
    });
    return parsed.meta.fields || [];
  };

  const getExcelHeaders = async (file: File): Promise<string[]> => {
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rawRows = XLSX.utils.sheet_to_json<
        (string | number | boolean | null)[]
      >(worksheet, {
        header: 1,
        defval: '',
      });

      if (rawRows.length > 0) {
        return rawRows[0].map((h) => String(h).trim());
      }
    } catch (e: unknown) {
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

    let successCount = 0;

    const totalCount = data.speakers.length;
    const errorCounts = new Map<string, number>();

    const existingCongs = await appDb.speakers_congregations.toArray();
    const existingVisitingSpeakers = await appDb.visiting_speakers.toArray();
    const settings = await appDb.app_settings.get(1);
    const persons = await appDb.persons.toArray();

    if (!settings) {
      return {
        successCount: 0,
        totalCount,
        errorReason: 'Settings not found',
        successfullyImported: [],
      };
    }

    const ownCongName = settings.cong_settings.cong_name;

    // Map for ID-based lookup (for filter conditions)
    const congIdMap = new Map<string, string>();
    // Map for name-based lookup (for mapping)
    const congNameMap = new Map<string, string>();
    existingCongs.forEach((c) => {
      if (!c._deleted.value && c.id) {
        congIdMap.set(c.id, c.cong_data.cong_name.value);
        congNameMap.set(c.cong_data.cong_name.value, c.id);
      }
    });

    // Own congregation ID (from settings)
    const myCongId = settings.cong_settings.cong_id;

    const existingSpeakerKeys = new Set(
      existingVisitingSpeakers
        .filter((s) => {
          // 1. Filter out speakers that are marked as deleted
          if (s._deleted.value) return false;

          const speakerCongId = s.speaker_data.cong_id;

          // 2. Check if the speaker's congregation is a known, active guest congregation
          // OR if it is the own congregation
          // OR if the name is "own" (legacy check)
          const hasActiveCongregation =
            congIdMap.has(speakerCongId) ||
            speakerCongId === myCongId ||
            speakerCongId === ownCongName ||
            speakerCongId === 'own';

          return hasActiveCongregation;
        })
        .map(
          (s) =>
            `${s.speaker_data.cong_id}|${s.speaker_data.person_firstname.value.trim().toLowerCase()}|${s.speaker_data.person_lastname.value.trim().toLowerCase()}`
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
        const isOwnCongregation = congKey === ownCongName;

        let existingPersonUid: string | undefined;

        if (isOwnCongregation) {
          const existingPerson = persons.find(
            (person) =>
              person.person_data.person_firstname.value.trim().toLowerCase() ===
                speaker.firstname.trim().toLowerCase() &&
              person.person_data.person_lastname.value.trim().toLowerCase() ===
                speaker.lastname.trim().toLowerCase()
          );

          if (existingPerson) {
            existingPersonUid = existingPerson.person_uid;
          } else {
            speaker.talks = [];
          }
        }

        let finalCongId = isOwnCongregation
          ? myCongId
          : congNameMap.get(congKey);

        if (finalCongId) {
          const existingCong = existingCongs.find((c) => c.id === finalCongId);

          const isSynced =
            existingCong?.cong_data?.cong_id &&
            existingCong.cong_data.cong_id.length > 0;

          if (isSynced) {
            const errorMsg = t('tr_congregationAlreadySynced');
            errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
            continue;
          }
        }

        if (!finalCongId && !isOwnCongregation) {
          const newCong = convertToDatabaseCongregation(congregation);
          await dbSpeakersCongregationsCreate(newCong);
          finalCongId = newCong.id!;
          congNameMap.set(congKey, finalCongId);
          congIdMap.set(finalCongId, congKey);
        }

        const speakerKey = `${finalCongId}|${speaker.firstname.trim().toLowerCase()}|${speaker.lastname.trim().toLowerCase()}`;
        if (existingSpeakerKeys.has(speakerKey)) {
          const errorMsg = t('tr_speakerAlreadyExists');
          errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
          continue;
        }

        const finalSpeaker = convertToDatabaseSpeaker(
          speaker,
          finalCongId!,
          existingPersonUid
        );

        await appDb.visiting_speakers.put(finalSpeaker);
        existingSpeakerKeys.add(speakerKey);

        successfullyImported.push(finalSpeaker);
        successCount++;
      } catch (error: unknown) {
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
