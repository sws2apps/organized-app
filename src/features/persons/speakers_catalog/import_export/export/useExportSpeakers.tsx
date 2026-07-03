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

const useExportSpeakers = () => {
  const { t } = useAppTranslation();
  const lng = useAtomValue(JWLangLocaleState);
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();
  const congregationUsers = useAtomValue(congregationUsersState);
  const persons = useAtomValue(personsState);

  const [isProcessing, setIsProcessing] = useState(false);

  // Resolve the contact person (name/email/phone) for a given cong role.
  // The own congregation does not store coordinator / public_talk_coordinator
  // contact details in `speakers_congregations`; instead the coordinator is
  // referenced via `settings.cong_settings.responsabilities.coordinator`
  // (person_uid) and the public talk coordinator is the user holding the
  // `public_talk_schedule` role. Both are resolved against the `persons`
  // table to obtain name, email and phone.
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

      // Determine the own congregation's record id in `speakers_congregations`.
      // The `cong_id` stored in `app_settings.cong_settings.cong_id` is the
      // remote congregation id, NOT the local record id used as
      // `speaker_data.cong_id`. The local record id is the `id` of the
      // `speakers_congregations` entry whose `cong_name` matches the
      // congregation name from settings.
      const myCongName = settings?.cong_settings.cong_name;
      const myCongRecord = congregations.find(
        (c) =>
          !c._deleted.value &&
          c.cong_data.cong_name.value === myCongName &&
          !!c.id
      );
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
