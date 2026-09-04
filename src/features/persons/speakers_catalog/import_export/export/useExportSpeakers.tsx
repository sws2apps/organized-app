// src/features/persons/speakers_catalog/import_export/export/useExportSpeakers.tsx
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import writeXlsxFile, { Row, SheetData } from 'write-excel-file/browser';
import Papa from 'papaparse';
import { IconError } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { JWLangLocaleState } from '@states/settings';
import { congregationUsersState } from '@states/congregation';
import { personsState } from '@states/persons';
import useSpeakersImportConfig from '../confirm_import/useSpeakersImportConfig';
import appDb from '@db/appDb';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import { SettingsType } from '@definition/settings';
import { CongregationUserType } from '@definition/api';
import { PersonType } from '@definition/person';
import {
  getCSVDelimiterByNumberFormat,
  arrayInCsvSeparator,
} from '@utils/csvFiles';

type ExportFormat = 'xlsx' | 'csv';

/**
 * Hook backing the export step of the speakers catalog: builds the export
 * matrix for the selected fields and downloads it as XLSX or CSV.
 *
 * Both formats share the same layout: row 1 contains the technical field
 * keys, row 2 the localized labels, followed by the data rows. The import
 * relies on this structure – its translation-row detection strips row 2.
 * Keep the two in sync when changing the header layout.
 */
const useExportSpeakers = () => {
  const { t } = useAppTranslation();
  const lng = useAtomValue(JWLangLocaleState);
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();
  const congregationUsers = useAtomValue(congregationUsersState);
  const persons = useAtomValue(personsState);

  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Resolves the contact details (name/email/phone) for a role of the own
   * congregation. The own congregation does not store coordinator contacts in
   * `speakers_congregations`; instead the coordinator is referenced via
   * `settings.cong_settings.responsabilities.coordinator` (person_uid) and the
   * public talk coordinator is the user holding the `public_talk_schedule`
   * role. Both are resolved against the persons table.
   *
   * @param {'coordinator' | 'public_talk_coordinator'} role - Which contact to resolve.
   * @param {SettingsType | undefined} settings - The app settings (source of the coordinator uid).
   * @param {PersonType[]} personsList - All locally stored persons.
   * @param {CongregationUserType[]} users - The congregation users (source of the talk coordinator role).
   * @returns {{ name: string; email: string; phone: string }} The contact details; empty strings when not resolvable.
   */
  const getOwnCongContact = (
    role: 'coordinator' | 'public_talk_coordinator',
    settings: SettingsType | undefined,
    personsList: PersonType[],
    users: CongregationUserType[]
  ): { name: string; email: string; phone: string } => {
    let personUid = '';

    if (role === 'coordinator') {
      personUid = settings?.cong_settings.responsabilities?.coordinator || '';
    } else {
      const talkCoordUser = users.find((u) =>
        u.profile.cong_role?.includes('public_talk_schedule')
      );
      personUid = talkCoordUser?.profile.user_local_uid || '';
    }

    if (!personUid) return { name: '', email: '', phone: '' };

    const person = personsList.find((p) => p.person_uid === personUid);
    if (!person) return { name: '', email: '', phone: '' };

    return {
      name: [
        person.person_data.person_firstname.value,
        person.person_data.person_lastname.value,
      ]
        .filter(Boolean)
        .join(' '),
      email: person.person_data.email.value || '',
      phone: person.person_data.phone.value || '',
    };
  };

  /**
   * Extracts one field value from a speaker record for the export matrix.
   * Booleans are rendered as "yes" / "" to match the import format.
   *
   * @param {VisitingSpeakerType} speaker - The speaker record.
   * @param {string} field - The field key (e.g. "speaker.firstname").
   * @returns {string} The cell value; empty for unknown keys or missing values.
   */
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

  /**
   * Extracts one congregation field value for the export matrix. For the own
   * congregation the values come from the app settings (coordinator contacts
   * are resolved via persons/roles); for guest congregations from the
   * `speakers_congregations` record.
   *
   * @param {SpeakersCongregationsType | undefined} congregation - The speaker's congregation record, if known.
   * @param {SettingsType | undefined} settings - The app settings (only used for the own congregation).
   * @param {boolean} isOwnCongregation - Whether the row belongs to the own congregation.
   * @param {string} field - The field key (e.g. "congregation.cong_name").
   * @returns {string} The cell value; empty for unknown keys or missing data.
   */
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

        // Coordinators for the own congregation are not stored in settings;
        // they are resolved from the congregation users (roles) and the
        // persons table.
        case 'congregation.coordinator.name':
          return getOwnCongContact(
            'coordinator',
            settings,
            persons,
            congregationUsers
          ).name;
        case 'congregation.coordinator.email':
          return getOwnCongContact(
            'coordinator',
            settings,
            persons,
            congregationUsers
          ).email;
        case 'congregation.coordinator.phone':
          return getOwnCongContact(
            'coordinator',
            settings,
            persons,
            congregationUsers
          ).phone;
        case 'congregation.public_talk_coordinator.name':
          return getOwnCongContact(
            'public_talk_coordinator',
            settings,
            persons,
            congregationUsers
          ).name;
        case 'congregation.public_talk_coordinator.email':
          return getOwnCongContact(
            'public_talk_coordinator',
            settings,
            persons,
            congregationUsers
          ).email;
        case 'congregation.public_talk_coordinator.phone':
          return getOwnCongContact(
            'public_talk_coordinator',
            settings,
            persons,
            congregationUsers
          ).phone;
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

  /**
   * Formats a speaker's active talks as an import-compatible talk list,
   * e.g. "1 (5, 90), 4". The separator follows the user's locale
   * (arrayInCsvSeparator), and the import parser accepts both "," and ";" –
   * so an exported file can be edited and re-imported directly.
   *
   * @param {VisitingSpeakerType} speaker - The speaker record.
   * @returns {string} The formatted talk list; empty when no active talks exist.
   */
  const formatTalks = (speaker: VisitingSpeakerType): string => {
    const listSeparator = arrayInCsvSeparator();
    const joinedSeparator = listSeparator + ' ';

    const talks = speaker.speaker_data.talks
      .filter((talk) => !talk._deleted)
      .map((talk) => {
        const talkNumber = talk.talk_number;
        const songs = talk.talk_songs.filter((song) => song > 0);

        if (songs.length > 0) {
          return `${talkNumber} (${songs.join(joinedSeparator)})`;
        }
        return String(talkNumber);
      });

    return talks.join(joinedSeparator);
  };

  /**
   * Builds the export file for the selected fields and triggers the download.
   *
   * Steps: load speakers, congregations, persons and settings; resolve the
   * own congregation's LOCAL record id (speaker_data.cong_id refers to
   * speakers_congregations.id, not the remote cong_id); drop deleted records
   * and speakers of unknown congregations; enrich own-congregation speakers
   * with their persons-table data (their speaker_data holds placeholders);
   * sanitize every cell against spreadsheet formula injection.
   *
   * @param {Record<string, boolean>} selectedFields - Field selection from the dialog (key -> included).
   * @param {ExportFormat} [format] - The export format, defaults to "xlsx".
   * @returns {Promise<void>} Resolves when the download was triggered.
   * @throws Rethrows any failure after showing an error notification, so the
   *         dialog knows NOT to close.
   */
  const handleExport = async (
    selectedFields: Record<string, boolean>,
    format: ExportFormat = 'xlsx'
  ): Promise<void> => {
    try {
      setIsProcessing(true);

      const speakers = await appDb.visiting_speakers.toArray();
      const congregations = await appDb.speakers_congregations.toArray();
      const persons = await appDb.persons.toArray();
      const settings = await appDb.app_settings.get(1);

      const myCongName = settings?.cong_settings.cong_name;
      const myCongRecord = congregations.find(
        (c) =>
          !c._deleted.value &&
          c.cong_data.cong_name.value === myCongName &&
          !!c.id
      );
      // resolve own congregation's local record id (see hook JSDoc)
      const myCongId = myCongRecord?.id;

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

      // Local speakers (own congregation) store their person data in the
      // `persons` table, not in `speaker_data`. Enrich them before export so
      // names, email, phone and elder/ms flags are present in the file.
      const personsMap = new Map(persons.map((p) => [p.person_uid, p]));
      const enrichedSpeakers = activeSpeakers.map((speaker) => {
        const isOwn = speaker.speaker_data.cong_id === myCongId;
        if (!isOwn) return speaker;

        const person = personsMap.get(speaker.person_uid);
        if (!person) return speaker;

        return {
          ...speaker,
          speaker_data: {
            ...speaker.speaker_data,
            person_firstname: {
              value: person.person_data.person_firstname.value,
              updatedAt: speaker.speaker_data.person_firstname.updatedAt,
            },
            person_lastname: {
              value: person.person_data.person_lastname.value,
              updatedAt: speaker.speaker_data.person_lastname.updatedAt,
            },
            person_display_name: {
              value: person.person_data.person_display_name.value,
              updatedAt: speaker.speaker_data.person_display_name.updatedAt,
            },
            person_email: {
              value: person.person_data.email.value,
              updatedAt: speaker.speaker_data.person_email?.updatedAt || '',
            },
            person_phone: {
              value: person.person_data.phone.value,
              updatedAt: speaker.speaker_data.person_phone?.updatedAt || '',
            },
          },
        } as VisitingSpeakerType;
      });

      enrichedSpeakers.sort((a, b) => {
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

      const sanitizeSpreadsheetCell = (value: string): string => {
        // Prevent CSV/Excel formula injection on open
        return /^[=\-@]/.test(value) ? `'${value}` : value;
      };

      const dataRows: string[][] = enrichedSpeakers.map((speaker) => {
        const congId = speaker.speaker_data.cong_id;
        const congregation = congMap.get(congId);

        // Safely check if it is the own congregation
        const isOwnCongregation = congId === myCongId;

        return exportFields.map((field) => {
          let raw = '';
          if (field.key.startsWith('speaker.')) {
            raw = getSpeakerValue(speaker, field.key);
            return sanitizeSpreadsheetCell(raw);
          } else if (field.key.startsWith('congregation.')) {
            raw = getCongregationValue(
              congregation,
              settings,
              isOwnCongregation,
              field.key
            );
            return sanitizeSpreadsheetCell(raw);
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

      let errorMessage: string;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = JSON.stringify(error, null, 2);
      }

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: errorMessage,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });

      throw error;
    }
  };

  /**
   * Writes the export matrix as an XLSX file. Row 1 holds the technical keys,
   * row 2 the localized labels (both bold and sticky); column widths are
   * chosen by field type.
   *
   * @param {string[]} headerKeys - Technical field keys, first row.
   * @param {string[]} headerLabels - Localized labels, second row.
   * @param {string[][]} dataRows - The sanitized cell values.
   * @param {typeof SPEAKER_FIELD_META} exportFields - The selected fields (used for column widths).
   * @returns {Promise<void>} Resolves when the file download was triggered.
   */
  const exportAsExcel = async (
    headerKeys: string[],
    headerLabels: string[],
    dataRows: string[][],
    exportFields: typeof SPEAKER_FIELD_META
  ): Promise<void> => {
    const data: SheetData = [];

    // Row 1: header keys (bold)
    const headerKeysRow: Row = headerKeys.map((key) => ({
      value: key,
      fontWeight: 'bold',
    }));
    data.push(headerKeysRow);

    // Row 2: header labels (bold)
    const headerLabelsRow: Row = headerLabels.map((label) => ({
      value: label,
      fontWeight: 'bold',
    }));
    data.push(headerLabelsRow);

    // Data rows
    for (const row of dataRows) {
      const excelRow: Row = row.map((cell) => ({ value: cell }));
      data.push(excelRow);
    }

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

  /**
   * Writes the export matrix as a CSV file with the locale-specific column
   * delimiter. A UTF-8 BOM is prepended so Excel detects the encoding
   * correctly (mirroring the BOM handling of the import's decodeCsvFile);
   * all cells are quoted.
   *
   * @param {string[]} headerKeys - Technical field keys, first row.
   * @param {string[]} headerLabels - Localized labels, second row.
   * @param {string[][]} dataRows - The sanitized cell values.
   * @returns {Promise<void>} Resolves when the file download was triggered.
   */
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
    link.remove();

    URL.revokeObjectURL(url);
  };

  const fileNameXlsx = 'speakers-export.xlsx';
  const fileNameCsv = 'speakers-export.csv';

  return { fileNameXlsx, fileNameCsv, isProcessing, handleExport };
};

export default useExportSpeakers;
