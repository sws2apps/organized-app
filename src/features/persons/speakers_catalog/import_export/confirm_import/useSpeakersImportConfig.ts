// src/features/persons/speakers_catalog/import_export/confirm_import/useSpeakersImportConfig.ts
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

// NEUE IMPORTE:
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

import { CongregationIncomingDetailsType } from '@definition/speakers_congregations'; // Oder wo der Typ liegt

// Der Draft-Typ nutzt jetzt die echten Typen
export type SpeakerImportDraftType = {
  congregation: CongregationIncomingDetailsType;
  speaker: SpeakerIncomingDetailsType;
};

/* // Factory nutzt jetzt die echten Factories
export const createEmptySpeakerDraft = (): SpeakerImportDraftType => ({
  congregation: createEmptyCongregation(),
  speaker: createEmptySpeaker(),
}); */

const useSpeakersImportConfig = () => {
  // Hilfsfunktion für Boolean (Ja/Nein/1/0)
  const toBool = (v: string) => {
    const lower = v.toLowerCase().trim();
    return (
      lower === 'yes' || lower === 'ja' || lower === '1' || lower === 'true'
    );
  };

  interface SpeakerFieldMeta {
    key: string;
    label: string;
    group: string;
    groupLabel: string;
    handler: (draft: SpeakerImportDraftType, value: string) => void;
    examples: readonly [string, string, string, string];
  }

  // 1. REDNER DATEN (Speaker) - Jetzt mit echten Handlern
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

  // 2. VORTRÄGE (Talks) - Nutzt den speziellen Split-Handler
  const TALK_FIELDS: SpeakerFieldMeta[] = [
    {
      key: 'speaker.talks', // Key angepasst, da es jetzt im Speaker-Objekt liegt
      label: 'tr_publicTalks',
      group: 'talks',
      groupLabel: 'tr_publicTalks',
      examples: ['1 (10, 5), 2, 5', '145, 12 (20)', '3', '77 (10)'],
      handler: (d, v) => updateSpeakerTalks(d.speaker, v),
    },
  ];

  // 3. VERSAMMLUNG (Congregation)
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
      group: 'congregation',
      groupLabel: 'tr_congregation',
      examples: ['19:00', '', '18:45', '19:15'],
      handler: (d, v) => updateMidweekTime(d.congregation, v),
    },
    {
      key: 'congregation.midweek_meeting.weekday',
      label: 'tr_midweekMeetingWeekday',
      group: 'congregation',
      groupLabel: 'tr_congregation',
      examples: ['2', '', '4', '3'],
      handler: (d, v) =>
        updateMidweekWeekday(d.congregation, parseInt(v, 10) || 2),
    },
    {
      key: 'congregation.weekend_meeting.time',
      label: 'tr_weekendMeetingTime',
      group: 'congregation',
      groupLabel: 'tr_congregation',
      examples: ['10:00', '', '13:00', '15:00'],
      handler: (d, v) => updateWeekendTime(d.congregation, v),
    },
    {
      key: 'congregation.weekend_meeting.weekday',
      label: 'tr_weekendMeetingWeekday',
      group: 'congregation',
      groupLabel: 'tr_congregation',
      examples: ['7', '', '7', '6'],
      handler: (d, v) =>
        updateWeekendWeekday(d.congregation, parseInt(v, 10) || 7),
    },
  ];

  // 4. KONTAKTE (Coordinators)
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

  const SPEAKER_FIELD_META: SpeakerFieldMeta[] = [
    ...SPEAKER_FIELDS,
    ...CONG_FIELDS,
    ...CONTACT_FIELDS,
    ...TALK_FIELDS,
  ];

  return { SPEAKER_FIELD_META };
};

export default useSpeakersImportConfig;
