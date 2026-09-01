// src/utils/speakers.ts
import { generateDisplayName } from '@utils/common';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export type IncomingTalkType = {
  number: number;
  songs: number[];
};

export type SpeakerIncomingDetailsType = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  is_elder: boolean;
  is_ms: boolean;
  talks: IncomingTalkType[];
};

export const createEmptySpeaker = (): SpeakerIncomingDetailsType => {
  return {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    is_elder: false,
    is_ms: false,
    talks: [],
  };
};

export const updateSpeakerFirstname = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.firstname = value;
};

export const updateSpeakerLastname = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.lastname = value;
};

export const updateSpeakerEmail = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.email = value;
};

export const updateSpeakerPhone = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.phone = value;
};

export const updateSpeakerElder = (
  speaker: SpeakerIncomingDetailsType,
  value: boolean
): void => {
  speaker.is_elder = value;
  // Logik: Ein Ältester kann kein Dienstamtgehilfe sein (optional, aber sauber)
  if (value) speaker.is_ms = false;
};

export const updateSpeakerMS = (
  speaker: SpeakerIncomingDetailsType,
  value: boolean
): void => {
  speaker.is_ms = value;
  // Logik: Ein Dienstamtgehilfe kann kein Ältester sein
  if (value) speaker.is_elder = false;
};

export class TalksListParseError extends Error {
  constructor(
    readonly input: string,
    readonly position: number
  ) {
    super('tr_importTalksInvalidFormat');
    this.name = 'TalksListParseError';
  }
}

const TALK_TOKEN_REGEX = /(\d+)\s*(?:\(([^)]*)\))?\s*/y;

export const parseSpeakerTalks = (value: string): IncomingTalkType[] => {
  const input = value.trim();
  if (input.length === 0) return [];

  const talks: IncomingTalkType[] = [];
  let pos = 0;

  while (pos < input.length) {
    TALK_TOKEN_REGEX.lastIndex = pos;
    const match = TALK_TOKEN_REGEX.exec(input);

    if (match === null) {
      throw new TalksListParseError(input, pos);
    }

    const talkNum = Number.parseInt(match[1], 10);
    if (Number.isNaN(talkNum) || talkNum <= 0) {
      throw new TalksListParseError(input, pos);
    }

    const songs = match[2]
      ? match[2]
          .split(/[,;]/)
          .map((s) => Number.parseInt(s.trim(), 10))
          .filter((n) => !Number.isNaN(n) && n > 0)
      : [];

    talks.push({ number: talkNum, songs });
    pos = TALK_TOKEN_REGEX.lastIndex;

    if (pos < input.length) {
      if (input[pos] !== ',' && input[pos] !== ';') {
        throw new TalksListParseError(input, pos);
      }
      pos++;
      while (pos < input.length && /\s/.test(input[pos])) pos++;

      if (pos === input.length) {
        throw new TalksListParseError(input, pos);
      }
    }
  }

  return talks;
};

export const updateSpeakerTalks = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.talks = parseSpeakerTalks(value);
};

export const convertToDatabaseSpeaker = (
  incoming: SpeakerIncomingDetailsType,
  congId: string,
  existingPersonUid?: string
): VisitingSpeakerType => {
  const now = new Date().toISOString();

  return {
    person_uid: existingPersonUid || crypto.randomUUID(),
    _deleted: { value: false, updatedAt: '' },
    speaker_data: {
      cong_id: congId,
      person_firstname: { value: incoming.firstname, updatedAt: now },
      person_lastname: { value: incoming.lastname, updatedAt: now },
      person_display_name: {
        value: generateDisplayName(incoming.lastname, incoming.firstname),
        updatedAt: now,
      },
      person_email: { value: incoming.email, updatedAt: now },
      person_phone: { value: incoming.phone, updatedAt: now },
      person_notes: { value: '', updatedAt: now },

      elder: { value: incoming.is_elder, updatedAt: now },
      ministerial_servant: { value: incoming.is_ms, updatedAt: now },
      local: { value: false, updatedAt: now },

      // UPDATE: Mapping der neuen Struktur
      talks: incoming.talks.map((t) => ({
        talk_number: t.number,
        talk_songs: t.songs, // Hier landen jetzt die Lieder!
        _deleted: false,
        updatedAt: now,
      })),
    },
  };
};
