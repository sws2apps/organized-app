// src/features/persons/speakers_catalog/import_export/confirm_import/useCSVImport.tsx
import Papa from 'papaparse';
import readXlsxFile from 'read-excel-file';
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

  /**
   * Safely converts any possible Excel cell value into a trimmed string.
   * Handles null, undefined, primitive types, and specifically formats Date objects.
   * Prevents SonarQube S6551 by avoiding implicit object-to-string coercion.
   *
   * @param {unknown} cell - The raw cell value returned by the Excel parser.
   * @returns {string} The formatted string representation of the cell value.
   */
  const cellToString = (cell: unknown): string => {
    if (cell == null) {
      // Covers null and undefined (empty cells)
      return '';
    }

    if (cell instanceof Date) {
      // Case 1: Time-only values (Excel internally stores times with years around 1900)
      const isExcelTimeOnly = cell.getUTCFullYear() < 1905;

      if (isExcelTimeOnly) {
        // Extract time in HH:mm format using UTC to avoid timezone shifts
        const hours = cell.getUTCHours().toString().padStart(2, '0');
        const minutes = cell.getUTCMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
      }

      // Case 2: Actual dates -> Format as DD.MM.YYYY
      const day = cell.getUTCDate().toString().padStart(2, '0');
      const month = (cell.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = cell.getUTCFullYear();

      return `${day}.${month}.${year}`;
    }

    if (typeof cell === 'object') {
      // Fallback for unexpected objects to prevent "[object Object]" stringification
      return JSON.stringify(cell);
    }

    // Safely convert primitives (string, number, boolean) and trim whitespace
    return String(cell as string | number | boolean).trim();
  };

  const parseExcel = async (file: File): Promise<RowData[]> => {
    try {
      const rawRows = (await readXlsxFile(file, { sheet: 1 })) as unknown[][];

      if (rawRows.length < 1) return [];

      const headers = rawRows[0].map((h) => cellToString(h));
      const dataRows = rawRows.slice(1);

      return dataRows.map((row) => {
        const rowObj: RowData = {};
        headers.forEach((header, index) => {
          rowObj[header] = cellToString(row[index]);
        });
        return rowObj;
      });
    } catch (err) {
      console.error('Excel parsing error:', err);
      return [];
    }
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

  /**
   * Processes a single data row, applies the mapped handlers, and updates the draft object.
   * Returns true if the speaker has a valid lastname and should be included.
   */
  const processRowData = (
    row: RowData,
    headerMapping: MappedHeader[],
    draft: SpeakerImportDraftType
  ): boolean => {
    for (const mapping of headerMapping) {
      const value = row[mapping.header];

      if (!value || value.trim() === '') continue;

      try {
        mapping.field.handler(draft, value);
      } catch (error) {
        console.error(`Error handling field ${mapping.header}:`, error);
      }
    }

    // Check if speaker has required minimum data
    return !!draft.speaker.lastname;
  };

  /**
   * Parses file contents (CSV string or Excel file) into structured arrays of speakers and congregations.
   * It groups speakers under their respective congregations. If a row omits congregation details,
   * the speaker inherits the previous row's congregation.
   *
   * @param {Object} fileData - The file information containing the type ('csv' | 'xlsx') and the actual contents.
   * @param {Record<string, boolean>} [selectedFields] - Optional filter object to determine which mapped fields should be imported.
   * @returns {Promise<{ speakers: SpeakerIncomingDetailsType[], congregations: CongregationIncomingDetailsType[] }>}
   */
  const parseFileToSpeakersAndCongs = async (
    fileData: { contents: string | File; type: 'csv' | 'xlsx' },
    selectedFields?: Record<string, boolean>
  ): Promise<{
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
  }> => {
    let dataRows: RowData[] = [];

    // Parse the data based on the provided file type
    if (fileData.type === 'xlsx' && fileData.contents instanceof File) {
      dataRows = await parseExcel(fileData.contents);
    } else if (typeof fileData.contents === 'string') {
      dataRows = parseCSV(fileData.contents);
    }

    dataRows = checkAndRemoveTranslationRow(dataRows);

    const headerMapping = buildHeaderMapping(
      dataRows,
      SPEAKER_FIELD_META,
      selectedFields
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

        const draft: SpeakerImportDraftType = {
          congregation: currentCongregation,
          speaker: createEmptySpeaker(),
        };

        // --- OUTSOURCED ROW LOGIC ---
        const isValid = processRowData(row, headerMapping, draft);

        if (!isValid) continue;

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
      const rawRows = (await readXlsxFile(file, { sheet: 1 })) as unknown[][];

      if (rawRows.length > 0) {
        return rawRows[0].map((h) => cellToString(h));
      }
    } catch (e: unknown) {
      console.error(e);
    }
    return [];
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
    let finalCongUid = congNameMap.get(congKey);

    if (isOwnCongregation && !finalCongUid) {
      await dbSpeakersCongregationsCreateLocal();
      const rows = await appDb.speakers_congregations.toArray();
      const ownCongRecord = rows.find(
        (c) => !c._deleted.value && c.cong_data.cong_name.value === ownCongName
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

  /**
   * Formats the aggregated error counts into a readable summary string,
   * sorted by descending occurrence count.
   */
  const formatErrorSummary = (errorCounts: Map<string, number>): string =>
    Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([message, count]) => `${count} x ${message}`)
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
        throw new Error(
          t('tr_speakerNotFoundInOwnCongregation', {
            name: `${speaker.firstname} ${speaker.lastname}`,
          })
        );
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
  }): Promise<SpeakerImportResult> => {
    let successCount = 0;
    const errorCounts = new Map<string, number>();
    const successfullyImported: VisitingSpeakerType[] = [];

    // Fetch necessary baseline data from the local database for validation and deduplication
    const existingCongs = await appDb.speakers_congregations.toArray();
    const existingVisitingSpeakers = await appDb.visiting_speakers.toArray();
    const settings = await appDb.app_settings.get(1);
    const persons = await appDb.persons.toArray();

    if (!settings) {
      return {
        successCount: 0,
        totalCount: data.speakers.length,
        errorReason: 'Settings not found',
        successfullyImported: [],
      };
    }

    const ownCongName = settings.cong_settings.cong_name;

    // Build lookup maps to quickly resolve local congregation UUIDs by name and vice versa
    const { congUidMap, congNameMap } = buildCongregationMaps(existingCongs);

    // Build a Set of composite keys to detect existing speakers and prevent duplicates
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

    // Iterate over all parsed rows to process and persist them
    for (let i = 0; i < data.speakers.length; i++) {
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
          errorCounts.set(
            result.reason,
            (errorCounts.get(result.reason) ?? 0) + 1
          );
        }
      } catch (error: unknown) {
        // Aggregate parsing and validation errors instead of crashing the entire import
        const errorMsg = error instanceof Error ? error.message : String(error);
        errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
      }
    }

    return {
      successCount,
      totalCount: data.speakers.length,
      errorReason: formatErrorSummary(errorCounts),
      successfullyImported,
    };
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
