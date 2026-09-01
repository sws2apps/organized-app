// src/features/persons/speakers_catalog/import_export/confirm_import/useSpeakersImportConfig.ts
import { useMemo } from 'react';
import {
  updateCongregationAddress,
  updateMidweekTime,
  updateMidweekWeekday,
  updateWeekendTime,
  updateWeekendWeekday,
  updateCoordinatorName,
  updateCoordinatorEmail,
  updateCoordinatorPhone,
  updatePublicTalkCoordinatorName,
  updatePublicTalkCoordinatorEmail,
  updatePublicTalkCoordinatorPhone,
} from '@utils/congregations';
import {
  updateSpeakerFirstname,
  updateSpeakerLastname,
  updateSpeakerEmail,
  updateSpeakerPhone,
  updateSpeakerElder,
  updateSpeakerMS,
  updateSpeakerTalks,
  SpeakerIncomingDetailsType,
} from '@utils/speakers';

import { CongregationIncomingDetailsType } from '@definition/speakers_congregations';

/**
 * Draft that import field handlers fill step by step: one congregation
 * (shared by consecutive rows until a new congregation name appears) and
 * one speaker per CSV row.
 */
export type SpeakerImportDraftType = {
  congregation: CongregationIncomingDetailsType;
  speaker: SpeakerIncomingDetailsType;
};

/**
 * Configuration of a single importable CSV column.
 */
export interface SpeakerFieldMeta {
  /** Column key as written in the CSV header row (matched case-insensitively). */
  key: string;
  /** i18n key of the column label shown in the UI and the template file. */
  label: string;
  /** Group id used to cluster fields in the confirm/export checkboxes. */
  group: string;
  /** i18n key of the group heading. */
  groupLabel: string;
  /**
   * Applies the raw cell value to the draft (mutated in place). May throw;
   * if `error.message` starts with "tr_" it is treated as an i18n key and
   * translated during error reporting.
   */
  handler: (draft: SpeakerImportDraftType, value: string) => void;
  /** Four sample values, used as the example rows in the template download. */
  examples: readonly [string, string, string, string];
}

/**
 * Central configuration of the speakers import/export: describes every
 * supported CSV column (key, label, grouping, example values) and the
 * handler that applies a raw cell value to the import draft.
 *
 * Consumed by the import, confirm and export steps as well as the template
 * download – changing a key or label here affects all of them.
 */
const useSpeakersImportConfig = () => {
  // parse boolean flag ("yes" / "1" / "true")
  const toBool = (v: string) => {
    const lower = v.toLowerCase().trim();
    return lower === 'yes' || lower === '1' || lower === 'true';
  };

  const SPEAKER_FIELD_META: SpeakerFieldMeta[] = useMemo(() => {
    // 1. speaker fields
    const SPEAKER_FIELDS: SpeakerFieldMeta[] = [
      {
        key: 'speaker.firstname',
        label: 'tr_firstname',
        group: 'speaker',
        groupLabel: 'tr_speakers',
        examples: ['John', 'Max', 'Peter', 'Andreas'],
        handler: (d, v) => updateSpeakerFirstname(d.speaker, v),
      },
      {
        key: 'speaker.lastname',
        label: 'tr_lastname',
        group: 'speaker',
        groupLabel: 'tr_speakers',
        examples: ['Doe', 'Mustermann', 'Smith', 'Müller'],
        handler: (d, v) => updateSpeakerLastname(d.speaker, v),
      },
      {
        key: 'speaker.email',
        label: 'tr_emailAddress',
        group: 'speaker',
        groupLabel: 'tr_speakers',
        examples: ['john@example.com', 'max@test.de', '', ''],
        handler: (d, v) => updateSpeakerEmail(d.speaker, v),
      },
      {
        key: 'speaker.phone',
        label: 'tr_phoneNumber',
        group: 'speaker',
        groupLabel: 'tr_speakers',
        examples: ['+1 234 567', '0171 1234567', '', ''],
        handler: (d, v) => updateSpeakerPhone(d.speaker, v),
      },
      {
        key: 'speaker.is_elder',
        label: 'tr_elder',
        group: 'speaker',
        groupLabel: 'tr_speakers',
        examples: ['yes', '', 'yes', ''],
        handler: (d, v) => updateSpeakerElder(d.speaker, toBool(v)),
      },
      {
        key: 'speaker.is_ms',
        label: 'tr_ministerialServant',
        group: 'speaker',
        groupLabel: 'tr_speakers',
        examples: ['', 'yes', '', 'yes'],
        handler: (d, v) => updateSpeakerMS(d.speaker, toBool(v)),
      },
    ];

    // 2. talks
    const TALK_FIELDS: SpeakerFieldMeta[] = [
      {
        key: 'speaker.talks',
        label: 'tr_publicTalks',
        group: 'talks',
        groupLabel: 'tr_publicTalks',
        examples: ['1 (10, 5), 2, 5', '145, 12 (20)', '3', '77 (10)'],
        handler: (d, v) => updateSpeakerTalks(d.speaker, v),
      },
    ];

    //3. congregation
    const CONG_FIELDS: SpeakerFieldMeta[] = [
      {
        key: 'congregation.cong_name',
        label: 'tr_congregationName',
        group: 'congregation',
        groupLabel: 'tr_congregation',
        examples: ['West', '', 'North', 'South'],
        handler: (d, v) => {
          d.congregation.cong_name = v;
        },
      },
      {
        key: 'congregation.cong_number',
        label: 'tr_congregationNumberFull',
        group: 'congregation',
        groupLabel: 'tr_congregation',
        examples: ['12345', '', '11223', '44556'],
        handler: (d, v) => {
          d.congregation.cong_number = v;
        },
      },
      {
        key: 'congregation.cong_location.address',
        label: 'tr_address',
        group: 'congregation',
        groupLabel: 'tr_congregation',
        examples: ['Main St 1', '', 'Via Roma 10', ''],
        handler: (d, v) => updateCongregationAddress(d.congregation, v),
      },
      {
        key: 'congregation.midweek_meeting.time',
        label: 'tr_midweekMeetingTime',
        group: 'congregationTime',
        groupLabel: 'tr_congregation_time',
        examples: ['19:00', '', '18:45', '19:15'],
        handler: (d, v) => updateMidweekTime(d.congregation, v),
      },
      {
        key: 'congregation.midweek_meeting.weekday',
        label: 'tr_midweekMeetingWeekday',
        group: 'congregationTime',
        groupLabel: 'tr_congregation_time',
        examples: ['2', '', '4', '3'],
        handler: (d, v) =>
          updateMidweekWeekday(d.congregation, Number.parseInt(v, 10) || 2),
      },
      {
        key: 'congregation.weekend_meeting.time',
        label: 'tr_weekendMeetingTime',
        group: 'congregationTime',
        groupLabel: 'tr_congregation_time',
        examples: ['10:00', '', '13:00', '15:00'],
        handler: (d, v) => updateWeekendTime(d.congregation, v),
      },
      {
        key: 'congregation.weekend_meeting.weekday',
        label: 'tr_weekendMeetingWeekday',
        group: 'congregationTime',
        groupLabel: 'tr_congregation_time',
        examples: ['7', '', '7', '6'],
        handler: (d, v) =>
          updateWeekendWeekday(d.congregation, Number.parseInt(v, 10) || 7),
      },
    ];

    // 4. contacts
    const CONTACT_FIELDS: SpeakerFieldMeta[] = [
      {
        key: 'congregation.coordinator.name',
        label: 'tr_coordinatorName',
        group: 'contacts',
        groupLabel: 'tr_contacts',
        examples: ['Br. Müller', '', '', 'Br. Peter'],
        handler: (d, v) => updateCoordinatorName(d.congregation, v),
      },
      {
        key: 'congregation.coordinator.email',
        label: 'tr_coordinatorEmail',
        group: 'contacts',
        groupLabel: 'tr_contacts',
        examples: ['boe@example.com', '', 'coord@test.com', ''],
        handler: (d, v) => updateCoordinatorEmail(d.congregation, v),
      },
      {
        key: 'congregation.coordinator.phone',
        label: 'tr_coordinatorPhone',
        group: 'contacts',
        groupLabel: 'tr_contacts',
        examples: ['+49 123 456', '', '', ''],
        handler: (d, v) => updateCoordinatorPhone(d.congregation, v),
      },
      {
        key: 'congregation.public_talk_coordinator.name',
        label: 'tr_publicTalkCoordinatorName',
        group: 'contacts',
        groupLabel: 'tr_contacts',
        examples: ['Br. Meier', '', '', ''],
        handler: (d, v) => updatePublicTalkCoordinatorName(d.congregation, v),
      },
      {
        key: 'congregation.public_talk_coordinator.email',
        label: 'tr_publicTalkCoordinatorEmail',
        group: 'contacts',
        groupLabel: 'tr_contacts',
        examples: ['talks@example.com', '', '', ''],
        handler: (d, v) => updatePublicTalkCoordinatorEmail(d.congregation, v),
      },
      {
        key: 'congregation.public_talk_coordinator.phone',
        label: 'tr_publicTalkCoordinatorPhone',
        group: 'contacts',
        groupLabel: 'tr_contacts',
        examples: ['+49 987 654', '', '', ''],
        handler: (d, v) => updatePublicTalkCoordinatorPhone(d.congregation, v),
      },
    ];

    return [
      ...SPEAKER_FIELDS,
      ...TALK_FIELDS,
      ...CONG_FIELDS,
      ...CONTACT_FIELDS,
    ];
  }, []);

  return { SPEAKER_FIELD_META };
};

export default useSpeakersImportConfig;
