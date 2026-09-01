// src/features/persons/speakers_catalog/import_export/confirm_import/useCSVImport.tsx
import Papa from 'papaparse';
import appDb from '@db/appDb';
import {
  dbSpeakersCongregationsCreate,
  dbSpeakersCongregationsCreateLocal,
} from '@services/dexie/speakers_congregations';
import {
  CongregationIncomingDetailsType,
  SpeakersCongregationsType,
} from '@definition/speakers_congregations';
import { PersonType } from '@definition/person';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { useAppTranslation } from '@hooks/index';
import {
  convertToDatabaseCongregation,
  createEmptyCongregation,
} from '@utils/congregations';
import {
  convertToDatabaseSpeaker,
  createEmptySpeaker,
  SpeakerIncomingDetailsType,
} from '@utils/speakers';
import useSpeakersImportConfig, {
  SpeakerImportDraftType,
  SpeakerFieldMeta,
} from './useSpeakersImportConfig';

export type SpeakerImportResult = {
  successCount: number;
  totalCount: number;
  errorReason: string;
  successfullyImported: VisitingSpeakerType[];
};

type RowData = Record<string, string>;

export type RowErrorType = {
  line: number;
  reasons: string[];
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

  type MappedHeader = { header: string; field: SpeakerFieldMeta };

  /**
   * Extracts and maps file headers to the configured import fields.
   * Filters out fields that are not selected or not found in the configuration.
   *
   * @param {RowData[]} dataRows - The parsed data rows from the file.
   * @param {SpeakerFieldMeta[]} fieldMeta - The configuration metadata for speaker fields.
   * @param {Record<string, boolean>} [selectedFields] - Optional filter object.
   * @returns {MappedHeader[]} The filtered header mapping.
   */
  const buildHeaderMapping = (
    dataRows: RowData[],
    fieldMeta: SpeakerFieldMeta[],
    selectedFields?: Record<string, boolean>
  ): MappedHeader[] => {
    if (dataRows.length === 0) return [];

    const headers = Object.keys(dataRows[0]);

    return (
      headers
        .map((header) => {
          const field = fieldMeta.find(
            (f) => f.key.toLowerCase() === header.toLowerCase()
          );
          return { header, field };
        })
        // Type Guard: Tells TypeScript that 'field' is guaranteed to exist after this filter
        .filter((item): item is MappedHeader => {
          if (!item.field) return false;
          if (selectedFields) return !!selectedFields[item.field.key];
          return true;
        })
    );
  };

  const processRowData = (
    row: RowData,
    headerMapping: MappedHeader[],
    draft: SpeakerImportDraftType,
    errors: string[]
  ): boolean => {
    for (const mapping of headerMapping) {
      const value = row[mapping.header];

      if (!value || value.trim() === '') continue;

      try {
        mapping.field.handler(draft, value);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);

        errors.push(
          reason.startsWith('tr_') ? t(reason) : `${mapping.header}: ${reason}`
        );
      }
    }
    if (!draft.speaker.lastname) {
      const hasAnyValue = Object.values(row).some((v) => v && v.trim() !== '');

      if (hasAnyValue) {
        errors.push(t('tr_importRowMissingLastname'));
      }

      return false;
    }

    return true;
  };

  /**
   * Parses file contents (CSV string) into structured arrays of speakers and congregations.
   * It groups speakers under their respective congregations. If a row omits congregation details,
   * the speaker inherits the previous row's congregation.
   *
   * @param {Object} fileData - The file information containing the type ('csv') and the actual contents.
   * @param {Record<string, boolean>} [selectedFields] - Optional filter object to determine which mapped fields should be imported.
   * @returns {Promise<{ speakers: SpeakerIncomingDetailsType[], congregations: CongregationIncomingDetailsType[] }>}
   */
  const parseFileToSpeakersAndCongs = async (
    fileData: { contents: string; type: 'csv' },
    selectedFields?: Record<string, boolean>
  ): Promise<{
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
    lines: number[];
    rowErrors: RowErrorType[];
  }> => {
    let dataRows: RowData[] = [];

    if (typeof fileData.contents === 'string') {
      dataRows = parseCSV(fileData.contents);
    }

    const rowsWithoutTranslation = checkAndRemoveTranslationRow(dataRows);
    const lineOffset = rowsWithoutTranslation.length < dataRows.length ? 3 : 2;
    dataRows = rowsWithoutTranslation;

    const headerMapping = buildHeaderMapping(
      dataRows,
      SPEAKER_FIELD_META,
      selectedFields
    );

    const resultSpeakers: SpeakerIncomingDetailsType[] = [];
    const resultCongregations: CongregationIncomingDetailsType[] = [];
    const resultLines: number[] = [];
    const rowErrors: RowErrorType[] = [];

    let currentCongregation = createEmptyCongregation();
    currentCongregation.cong_name = 'OwnCongregation';

    const congNameMapping = headerMapping.find(
      (m) => m.field.key.toLowerCase() === 'congregation.cong_name'
    );

    for (const [index, row] of dataRows.entries()) {
      const line = index + lineOffset;

      try {
        const congNameValue = congNameMapping
          ? (row[congNameMapping.header] ?? '').trim()
          : '';

        if (congNameValue) {
          currentCongregation = createEmptyCongregation();
        }

        const draft: SpeakerImportDraftType = {
          congregation: currentCongregation,
          speaker: createEmptySpeaker(),
        };

        const fieldErrors: string[] = [];
        const isValid = processRowData(row, headerMapping, draft, fieldErrors);

        if (fieldErrors.length > 0) {
          rowErrors.push({ line, reasons: fieldErrors });
          continue;
        }

        if (!isValid) continue;

        resultCongregations.push(draft.congregation);
        resultSpeakers.push(draft.speaker);
        resultLines.push(line);
      } catch (error) {
        rowErrors.push({
          line,
          reasons: [error instanceof Error ? error.message : String(error)],
        });
      }
    }

    return {
      speakers: resultSpeakers,
      congregations: resultCongregations,
      lines: resultLines,
      rowErrors,
    };
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

  // --- Import helpers -------------------------------------------------------

  /**
   * Composite key (congUid|firstname|lastname) used to detect duplicate speakers.
   * Centralized here so the key format cannot drift between call sites.
   */
  const buildSpeakerKey = (
    congUid: string,
    firstname: string,
    lastname: string
  ): string =>
    `${congUid}|${firstname.trim().toLowerCase()}|${lastname.trim().toLowerCase()}`;

  const findExistingPersonUid = (
    speaker: SpeakerIncomingDetailsType,
    persons: PersonType[]
  ): string | undefined => {
    const existingPerson = persons.find(
      (person) =>
        person.person_data.person_firstname.value.trim().toLowerCase() ===
          speaker.firstname.trim().toLowerCase() &&
        person.person_data.person_lastname.value.trim().toLowerCase() ===
          speaker.lastname.trim().toLowerCase()
    );

    return existingPerson ? existingPerson.person_uid : undefined;
  };

  /**
   * Builds the two lookup maps (UUID -> name and name -> UUID) for all active
   * congregations currently stored in the local database.
   */
  const buildCongregationMaps = (
    existingCongs: SpeakersCongregationsType[]
  ): {
    congUidMap: Map<string, string>;
    congNameMap: Map<string, string>;
  } => {
    const congUidMap = new Map<string, string>();
    const congNameMap = new Map<string, string>();

    existingCongs.forEach((c) => {
      if (!c._deleted.value && c.id) {
        congUidMap.set(c.id, c.cong_data.cong_name.value);
        congNameMap.set(c.cong_data.cong_name.value, c.id);
      }
    });

    return { congUidMap, congNameMap };
  };

  /**
   * Builds a Set of composite speaker keys for all active visiting speakers that
   * are linked to a known local congregation UUID. Used to detect duplicates.
   */
  const buildExistingSpeakerKeys = (
    existingVisitingSpeakers: VisitingSpeakerType[],
    congUidMap: Map<string, string>
  ): Set<string> =>
    new Set(
      existingVisitingSpeakers
        .filter(
          (s) => !s._deleted.value && congUidMap.has(s.speaker_data.cong_id)
        )
        .map((s) =>
          buildSpeakerKey(
            s.speaker_data.cong_id,
            s.speaker_data.person_firstname.value,
            s.speaker_data.person_lastname.value
          )
        )
    );

  /**
   * Resolves the local database UUID for a given congregation.
   * If the congregation does not exist locally, it creates it.
   */
  const resolveCongregationUid = async (
    congregation: CongregationIncomingDetailsType,
    congKey: string,
    isOwnCongregation: boolean,
    ownCongName: string,
    congNameMap: Map<string, string>,
    congUidMap: Map<string, string>,
    existingCongs: SpeakersCongregationsType[]
  ): Promise<string | undefined> => {
    let finalCongUid = isOwnCongregation
      ? existingCongs.find(
          (c) =>
            !c._deleted.value &&
            c.cong_data.cong_name.value === ownCongName &&
            !c.cong_data.cong_id?.length
        )?.id
      : congNameMap.get(congKey);

    if (isOwnCongregation && !finalCongUid) {
      await dbSpeakersCongregationsCreateLocal();
      const rows = await appDb.speakers_congregations.toArray();
      const ownCongRecord = rows.find(
        (c) =>
          !c._deleted.value &&
          c.cong_data.cong_name.value === ownCongName &&
          !c.cong_data.cong_id?.length
      );

      if (ownCongRecord?.id) {
        finalCongUid = ownCongRecord.id;
        congNameMap.set(congKey, finalCongUid);
        congUidMap.set(finalCongUid, congKey);
        existingCongs.push(ownCongRecord);
      }
    }

    if (!finalCongUid && !isOwnCongregation) {
      const newCong = convertToDatabaseCongregation(congregation);
      await dbSpeakersCongregationsCreate(newCong);
      finalCongUid = newCong.id!;
      congNameMap.set(congKey, finalCongUid);
      congUidMap.set(finalCongUid, congKey);
    }

    return finalCongUid;
  };

  const formatErrorSummary = (
    errorCounts: Map<string, { count: number; lines: number[] }>
  ): string =>
    Array.from(errorCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([message, { count, lines }]) => {
        const suffix =
          lines.length > 0
            ? ` (${t('tr_csvRows')}: ${lines.slice(0, 10).join(', ')}${
                lines.length > 10 ? ', …' : ''
              })`
            : '';
        return `${count} x ${message}${suffix}`;
      })
      .join('. ');

  /**
   * Processes a single parsed row: validates, resolves the congregation UUID,
   * checks for duplicates, and persists the speaker. Returns a discriminated
   * result so the caller can aggregate success/skip/error uniformly.
   *
   * @param {SpeakerIncomingDetailsType} speaker - The parsed speaker data to process.
   * @param {CongregationIncomingDetailsType} congregation - The congregation data associated with the speaker.
   * @param {Object} ctx - The shared processing context containing caches and configurations.
   * @param {string} ctx.ownCongName - The name of the user's local congregation.
   * @param {PersonType[]} ctx.persons - Array of locally existing persons.
   * @param {SpeakersCongregationsType[]} ctx.existingCongs - Array of existing congregations in the local DB.
   * @param {Map<string, string>} ctx.congUidMap - Lookup map mapping local congregation UUIDs to their names.
   * @param {Map<string, string>} ctx.congNameMap - Lookup map mapping congregation names to their local UUIDs.
   * @param {Set<string>} ctx.existingSpeakerKeys - A Set of composite keys used to track and prevent duplicate speakers.
   * @returns {Promise<{ kind: 'ok'; speaker: VisitingSpeakerType } | { kind: 'skipped'; reason: string }>}
   *          A discriminated union indicating whether the speaker was successfully imported or skipped.
   */
  const processRow = async (
    speaker: SpeakerIncomingDetailsType,
    congregation: CongregationIncomingDetailsType,
    ctx: {
      ownCongName: string;
      persons: PersonType[];
      existingCongs: SpeakersCongregationsType[];
      congUidMap: Map<string, string>;
      congNameMap: Map<string, string>;
      existingSpeakerKeys: Set<string>;
    }
  ): Promise<
    | { kind: 'ok'; speaker: VisitingSpeakerType }
    | { kind: 'skipped'; reason: string }
  > => {
    // Normalize placeholder names to the actual local congregation name
    congregation.cong_name =
      congregation.cong_name === 'OwnCongregation'
        ? ctx.ownCongName
        : congregation.cong_name;

    const congKey = congregation.cong_name;
    const isOwnCongregation = congKey === ctx.ownCongName;

    let existingPersonUid: string | undefined;

    // If the speaker belongs to the local congregation, ensure they exist in the
    // local persons database. Importing a "ghost" person is strictly prohibited.
    if (isOwnCongregation) {
      existingPersonUid = findExistingPersonUid(speaker, ctx.persons);

      if (!existingPersonUid) {
        throw new Error(t('tr_speakerNotFoundInOwnCongregation'));
      }
    }

    // Retrieve the local congregation UUID, or create the congregation if it's new
    const finalCongUid = await resolveCongregationUid(
      congregation,
      congKey,
      isOwnCongregation,
      ctx.ownCongName,
      ctx.congNameMap,
      ctx.congUidMap,
      ctx.existingCongs
    );

    if (!finalCongUid) throw new Error('Could not resolve congregation UUID');

    // Prevent modifying congregations that are already synced with an external source
    const existingCong = ctx.existingCongs.find((c) => c.id === finalCongUid);
    if (existingCong?.cong_data?.cong_id?.length) {
      return { kind: 'skipped', reason: t('tr_congregationAlreadySynced') };
    }

    // Verify that the speaker doesn't already exist in the resolved congregation
    const speakerKey = buildSpeakerKey(
      finalCongUid,
      speaker.firstname,
      speaker.lastname
    );
    if (ctx.existingSpeakerKeys.has(speakerKey)) {
      return { kind: 'skipped', reason: t('tr_speakerAlreadyExists') };
    }

    // Finalize the speaker object and persist it to the database
    const finalSpeaker = convertToDatabaseSpeaker(
      speaker,
      finalCongUid,
      existingPersonUid
    );
    await appDb.visiting_speakers.put(finalSpeaker);

    // Update local caches to immediately detect duplicates within the same batch
    ctx.existingSpeakerKeys.add(speakerKey);

    return { kind: 'ok', speaker: finalSpeaker };
  };

  /**
   * Processes arrays of parsed speakers and congregations and imports them into the local database.
   * It handles deduplication of congregations and speakers, resolves local person UUIDs for the
   * user's own congregation, and aggregates any validation errors encountered during the import.
   *
   * @param {Object} data - The parsed import data.
   * @param {SpeakerIncomingDetailsType[]} data.speakers - Array of speaker records to import.
   * @param {CongregationIncomingDetailsType[]} data.congregations - Array of congregation records corresponding to the speakers.
   * @returns {Promise<SpeakerImportResult>} An object containing import statistics, error summaries, and the successfully imported speaker records.
   */
  const addSpeakersToDB = async (data: {
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
    lines: number[];
    rowErrors: RowErrorType[];
  }): Promise<SpeakerImportResult> => {
    let successCount = 0;
    const errorCounts = new Map<string, { count: number; lines: number[] }>();
    const successfullyImported: VisitingSpeakerType[] = [];

    const addError = (reason: string, line?: number) => {
      const entry = errorCounts.get(reason) ?? { count: 0, lines: [] };
      entry.count++;
      if (line !== undefined) entry.lines.push(line);
      errorCounts.set(reason, entry);
    };

    // Fehler aus der Parse-Phase (ungültige Vorträge, fehlende Nachnamen)
    for (const rowError of data.rowErrors) {
      for (const reason of rowError.reasons) {
        addError(reason, rowError.line);
      }
    }

    const existingCongs = await appDb.speakers_congregations.toArray();
    const existingVisitingSpeakers = await appDb.visiting_speakers.toArray();
    const settings = await appDb.app_settings.get(1);
    const persons = await appDb.persons.toArray();

    if (!settings) {
      return {
        successCount: 0,
        totalCount: data.speakers.length + data.rowErrors.length,
        errorReason: 'Settings not found',
        successfullyImported: [],
      };
    }

    const ownCongName = settings.cong_settings.cong_name;
    const { congUidMap, congNameMap } = buildCongregationMaps(existingCongs);
    const existingSpeakerKeys = buildExistingSpeakerKeys(
      existingVisitingSpeakers,
      congUidMap
    );

    const ctx = {
      ownCongName,
      persons,
      existingCongs,
      congUidMap,
      congNameMap,
      existingSpeakerKeys,
    };

    for (let i = 0; i < data.speakers.length; i++) {
      const line = data.lines[i];

      try {
        const result = await processRow(
          data.speakers[i],
          data.congregations[i],
          ctx
        );

        if (result.kind === 'ok') {
          successfullyImported.push(result.speaker);
          successCount++;
        } else {
          addError(result.reason, line);
        }
      } catch (error: unknown) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        addError(errorMsg, line);
      }
    }

    return {
      successCount,
      totalCount: data.speakers.length + data.rowErrors.length,
      errorReason: formatErrorSummary(errorCounts),
      successfullyImported,
    };
  };

  return {
    detectDelimiter,
    getCSVHeaders,
    getSpeakerPaths,
    getSpeakerPathsTranslated,
    parseFileToSpeakersAndCongs,
    addSpeakersToDB,
  };
};

export default useCSVImport;
