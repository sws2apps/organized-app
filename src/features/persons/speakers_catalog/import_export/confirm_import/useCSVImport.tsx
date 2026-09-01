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

/**
 * Aggregated outcome of {@link addSpeakersToDB}.
 */
export type SpeakerImportResult = {
  /** Number of speakers actually persisted. */
  successCount: number;
  /** Number of CSV data rows processed (imported + rejected). */
  totalCount: number;
  /** Human-readable summary of all aggregated error reasons; empty when none occurred. */
  errorReason: string;
  /** The speaker records that were successfully written to the database. */
  successfullyImported: VisitingSpeakerType[];
};

/** One parsed CSV data row: maps (trimmed) column headers to raw cell values. */
type RowData = Record<string, string>;

export type RowErrorType = {
  /** 1-based line number within the uploaded CSV file (header = line 1). */
  line: number;
  /** All validation messages collected for this row (already localized). */
  reasons: string[];
};

/**
 * Hook providing the CSV import pipeline for the speakers catalog: parsing
 * the uploaded file into speaker/congregation drafts and persisting them
 * with deduplication and aggregated error reporting.
 */
const useCSVImport = () => {
  const { t } = useAppTranslation();
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  /**
   * Returns the technical field keys of all configured import fields
   * (e.g. "speaker.firstname"), as used in the CSV header row.
   *
   * @returns {string[]} The field keys in configuration order.
   */
  const getSpeakerPaths = (): string[] => {
    return SPEAKER_FIELD_META.map((field) => field.key);
  };

  /**
   * Returns the localized labels of all configured import fields. Used to
   * detect the translated label row that template files contain below the
   * technical header row.
   *
   * @returns {string[]} The translated field labels in configuration order.
   */
  const getSpeakerPathsTranslated = (): string[] => {
    return SPEAKER_FIELD_META.map((field) => t(field.label));
  };

  /**
   * Auto-detects the column delimiter of a CSV text by letting PapaParse
   * inspect the first line.
   *
   * @param {string} csvText - The raw CSV file contents.
   * @returns {string} The detected delimiter, falling back to ",".
   */
  const detectDelimiter = (csvText: string): string => {
    const { meta } = Papa.parse<RowData>(csvText, {
      preview: 1,
      delimiter: '',
      skipEmptyLines: 'greedy',
    });
    return meta.delimiter ?? ',';
  };

  /**
   * Detects and removes the optional second row of template files that
   * contains the translated column labels instead of actual data.
   *
   * Heuristic: the row counts as a translation row if more than 30% of its
   * filled cells match known field labels, or if at least 3 cells match –
   * a real speaker would hardly be named exactly "First Name" "Last Name".
   *
   * @param {RowData[]} dataRows - All parsed data rows (without the technical header).
   * @returns {RowData[]} The rows without the translation row, or the input unchanged.
   */
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

  /**
   * Parses raw CSV text into row objects using the first line as headers.
   * Parser errors are logged but do not abort the import.
   *
   * @param {string} csvText - The raw CSV file contents.
   * @returns {RowData[]} The parsed data rows (empty lines are dropped).
   */
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

  /** Associates a CSV column header with the import field it maps to. */
  type MappedHeader = { header: string; field: SpeakerFieldMeta };

  /**
   * Maps the CSV column headers to the configured import fields, matching
   * case-insensitively. Columns without a matching field – and fields the
   * user deselected in the confirm step – are excluded.
   *
   * @param {RowData[]} dataRows - The parsed data rows (used to read the header names).
   * @param {SpeakerFieldMeta[]} fieldMeta - The field configuration to map against.
   * @param {Record<string, boolean>} [selectedFields] - Optional field selection; when given, only selected fields are mapped.
   * @returns {MappedHeader[]} The resolved header/field pairs in column order.
   */
  const buildHeaderMapping = (
    dataRows: RowData[],
    fieldMeta: SpeakerFieldMeta[],
    selectedFields?: Record<string, boolean>
  ): MappedHeader[] => {
    if (dataRows.length === 0) return [];

    const headers = Object.keys(dataRows[0]);

    return headers
      .map((header) => {
        const field = fieldMeta.find(
          (f) => f.key.toLowerCase() === header.toLowerCase()
        );
        return { header, field };
      })

      .filter((item): item is MappedHeader => {
        if (!item.field) return false;
        if (selectedFields) return !!selectedFields[item.field.key];
        return true;
      });
  };

  /**
   * Applies every mapped field handler to one CSV row, filling the draft.
   * Handler failures (e.g. a malformed talk list) are collected as localized
   * messages in `errors` instead of aborting; messages looking like an i18n
   * key ("tr_…") are translated first, anything else is prefixed with the
   * column header for context.
   *
   * A row is only importable if a last name was set. Rows containing data
   * but no last name are reported via `errors` as well; completely empty
   * rows fail silently by design.
   *
   * @param {RowData} row - The CSV row to process.
   * @param {MappedHeader[]} headerMapping - The resolved header/field mapping.
   * @param {SpeakerImportDraftType} draft - The draft to fill (mutated in place).
   * @param {string[]} errors - Collector receiving one localized message per failed field.
   * @returns {boolean} True if the row may be imported, false otherwise.
   */
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
   * Parses the uploaded CSV file into speakers and congregations. Speakers
   * are grouped under their congregation: a row without congregation values
   * inherits the previous row's congregation; rows before the first
   * congregation entry belong to the user's own congregation.
   *
   * Rows with invalid fields are skipped entirely (no partial import) and
   * reported in `rowErrors` with their CSV line number. Line numbers are
   * 1-based and account for the header row and the optional translation row;
   * they can drift slightly when the file contains blank lines, since those
   * are dropped during parsing.
   *
   * @param {Object} fileData - The uploaded file payload.
   * @param {string} fileData.contents - The raw CSV text.
   * @param {'csv'} fileData.type - The file type discriminator.
   * @param {Record<string, boolean>} [selectedFields] - Optional field selection from the confirm step.
   * @returns {Promise<{ speakers: SpeakerIncomingDetailsType[]; congregations: CongregationIncomingDetailsType[]; lines: number[]; rowErrors: RowErrorType[] }>}
   *          `speakers` and `congregations` are aligned by index; `lines[i]`
   *          is the CSV line number of `speakers[i]`.
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

  /**
   * Reads only the header row of a CSV text. Used right after file selection
   * to offer the field checkboxes in the confirm step.
   *
   * @param {string} csvText - The raw CSV file contents.
   * @returns {string[]} The trimmed column headers in file order.
   */
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
   * Builds the composite key (congUid|firstname|lastname) used to detect
   * duplicate speakers. Centralized here so the key format cannot drift
   * between call sites.
   *
   * @param {string} congUid - The local record id of the congregation.
   * @param {string} firstname - The speaker's first name.
   * @param {string} lastname - The speaker's last name.
   * @returns {string} The normalized composite key (trimmed, lowercased).
   */
  const buildSpeakerKey = (
    congUid: string,
    firstname: string,
    lastname: string
  ): string =>
    `${congUid}|${firstname.trim().toLowerCase()}|${lastname.trim().toLowerCase()}`;

  /**
   * Looks up the person record matching a speaker by first and last name
   * (case-insensitive). Used for speakers of the own congregation, whose
   * data lives in the persons table rather than in speaker_data.
   *
   * @param {SpeakerIncomingDetailsType} speaker - The speaker to find.
   * @param {PersonType[]} persons - All locally stored persons.
   * @returns {string | undefined} The matching person_uid, or undefined if none exists.
   */
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
   * congregations currently stored in the local database. Soft-deleted
   * records and records without an id are ignored.
   *
   * @param {SpeakersCongregationsType[]} existingCongs - All stored congregation records.
   * @returns {{ congUidMap: Map<string, string>; congNameMap: Map<string, string> }} The two lookup maps.
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
   * Builds a set of composite speaker keys for all active visiting speakers
   * linked to a known local congregation UUID. Used to detect duplicates
   * before importing.
   *
   * @param {VisitingSpeakerType[]} existingVisitingSpeakers - All stored visiting speakers.
   * @param {Map<string, string>} congUidMap - Known local congregation UUIDs.
   * @returns {Set<string>} The composite keys of the existing speakers.
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
   * Resolves the local database UUID for a congregation, creating the record
   * when it does not exist yet. Rows of the own congregation always resolve
   * to the local, unsynced record (identified by an empty remote cong_id) –
   * never to a synced congregation that happens to share the name. Resolved
   * ids are cached in the lookup maps.
   *
   * @param {CongregationIncomingDetailsType} congregation - The congregation data of the current row.
   * @param {string} congKey - The congregation name used as map key.
   * @param {boolean} isOwnCongregation - Whether the row belongs to the user's own congregation.
   * @param {string} ownCongName - The own congregation's name from the app settings.
   * @param {Map<string, string>} congNameMap - Name -> UUID lookup (updated on cache miss).
   * @param {Map<string, string>} congUidMap - UUID -> name lookup (updated on cache miss).
   * @param {SpeakersCongregationsType[]} existingCongs - Known congregation records (extended when the own record is created).
   * @returns {Promise<string | undefined>} The local congregation UUID, or undefined if it could not be resolved.
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

  /**
   * Formats the aggregated errors into a readable summary string, sorted by
   * descending occurrence count. Affected CSV line numbers are appended per
   * reason, capped at 10 to keep the notification readable.
   *
   * @param {Map<string, { count: number; lines: number[] }>} errorCounts - Aggregated errors keyed by message.
   * @returns {string} The formatted summary, e.g. "3 x Speaker already exists (CSV rows: 5, 9, 11)".
   */
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
   * @throws {Error} If the speaker belongs to the own congregation but no
   *         matching person record exists, or if the congregation UUID
   *         cannot be resolved.
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
   * Imports the parsed speakers into the local database: resolves or creates
   * their congregations, skips duplicates and already-synced congregations,
   * and requires speakers of the own congregation to exist in the persons
   * table. Errors from both phases (parsing and persisting) are aggregated
   * by message together with their CSV line numbers – a single faulty row
   * never aborts the whole import.
   *
   * @param {Object} data - The parsed import data.
   * @param {SpeakerIncomingDetailsType[]} data.speakers - Speaker records to import.
   * @param {CongregationIncomingDetailsType[]} data.congregations - Congregation per speaker, aligned by index.
   * @param {number[]} data.lines - CSV line number per speaker, aligned by index.
   * @param {RowErrorType[]} data.rowErrors - Rows already rejected during parsing.
   * @returns {Promise<SpeakerImportResult>} Import statistics, the formatted error summary and the imported records.
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

    // carry over errors from the parse phase (invalid talk lists, missing last names)
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
