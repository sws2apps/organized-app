// src/utils/speakers.ts
import { generateDisplayName } from '@utils/common';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

/**
 * A single public talk as parsed from import or form input, together with
 * the songs assigned to it.
 */
export type IncomingTalkType = {
  /** Number of the public talk (positive integer). */
  number: number;
  /** Song numbers assigned to this talk; empty if none were given. */
  songs: number[];
};

/**
 * Intermediate representation of a visiting speaker. Used by the CSV import
 * and manual input forms before the record is converted into the database
 * structure via {@link convertToDatabaseSpeaker}.
 */
export type SpeakerIncomingDetailsType = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  is_elder: boolean;
  is_ms: boolean;
  talks: IncomingTalkType[];
};

/**
 * Creates a speaker object with empty/default values. Used as the starting
 * point for the field-by-field import handlers and input forms.
 *
 * @returns {SpeakerIncomingDetailsType} A new speaker with blank fields,
 *          no privileges and no talks.
 */
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

/**
 * Sets the speaker's first name.
 *
 * @param {SpeakerIncomingDetailsType} speaker - The speaker object to update (mutated in place).
 * @param {string} value - The new first name.
 */
export const updateSpeakerFirstname = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.firstname = value;
};

/**
 * Sets the speaker's last name.
 *
 * @param {SpeakerIncomingDetailsType} speaker - The speaker object to update (mutated in place).
 * @param {string} value - The new last name.
 */
export const updateSpeakerLastname = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.lastname = value;
};

/**
 * Sets the speaker's email address.
 *
 * @param {SpeakerIncomingDetailsType} speaker - The speaker object to update (mutated in place).
 * @param {string} value - The new email address.
 */
export const updateSpeakerEmail = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.email = value;
};

/**
 * Sets the speaker's phone number.
 *
 * @param {SpeakerIncomingDetailsType} speaker - The speaker object to update (mutated in place).
 * @param {string} value - The new phone number.
 */
export const updateSpeakerPhone = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.phone = value;
};

/**
 * Sets or clears the elder privilege. Setting it also clears the
 * ministerial servant flag, since the two privileges are mutually exclusive.
 *
 * @param {SpeakerIncomingDetailsType} speaker - The speaker object to update (mutated in place).
 * @param {boolean} value - Whether the speaker is an elder.
 */
export const updateSpeakerElder = (
  speaker: SpeakerIncomingDetailsType,
  value: boolean
): void => {
  speaker.is_elder = value;
  // an elder cannot be a ministerial servant
  if (value) speaker.is_ms = false;
};

/**
 * Sets or clears the ministerial servant privilege. Setting it also clears
 * the elder flag, since the two privileges are mutually exclusive.
 *
 * @param {SpeakerIncomingDetailsType} speaker - The speaker object to update (mutated in place).
 * @param {boolean} value - Whether the speaker is a ministerial servant.
 */
export const updateSpeakerMS = (
  speaker: SpeakerIncomingDetailsType,
  value: boolean
): void => {
  speaker.is_ms = value;
  // a ministerial servant cannot be an elder
  if (value) speaker.is_elder = false;
};

/**
 * Error thrown when a talk list string does not fully match the expected
 * format. `message` is intentionally the i18n key `tr_importTalksInvalidFormat`
 * rather than a finished text, so that callers with access to the
 * translation function can localize it.
 */
export class TalksListParseError extends Error {
  /**
   * @param {string} input - The offending (trimmed) input string.
   * @param {number} position - Character offset within `input` at which parsing failed.
   */
  constructor(
    readonly input: string,
    readonly position: number
  ) {
    super('tr_importTalksInvalidFormat');
    this.name = 'TalksListParseError';
  }
}

// Sticky token (flag "y"): matches ONLY exactly at lastIndex.
// Group 1: talk number (required), Group 2: optional songs in parentheses
const TALK_TOKEN_REGEX = /(\d+)\s*(?:\(([^)]*)\))?\s*/y;

/**
 * Strict parser for the talk list pattern "1 (5, 90), 4 (6, 20)".
 *
 * Accepted elements:
 * - "1"          -> talk 1, no songs
 * - "1 (5)"      -> talk 1 with song 5
 * - "1 (5, 90)"  -> talk 1 with songs 5 and 90 (songs separated by "," or ";")
 *
 * Unlike a global regex search, the ENTIRE input is validated using sticky
 * token matching: any unmatched character (e.g. an unclosed parenthesis or
 * stray text between entries) throws a {@link TalksListParseError} instead
 * of silently producing incorrect talks. Entries may be separated by ","
 * or ";" to stay locale-agnostic.
 *
 * @param {string} value - The raw talk list string to parse.
 * @returns {IncomingTalkType[]} The parsed talks in input order; an empty
 *          array for blank input.
 * @throws {TalksListParseError} If any part of the input does not match
 *         the expected pattern.
 *
 * @example
 * parseSpeakerTalks('1 (5, 90), 4');
 * // => [{ number: 1, songs: [5, 90] }, { number: 4, songs: [] }]
 */
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

/**
 * Parses a talk list string and assigns the result to the speaker. On
 * invalid input a {@link TalksListParseError} is thrown and `speaker.talks`
 * is left unchanged, since the assignment happens only after the complete
 * input was parsed successfully.
 *
 * @param {SpeakerIncomingDetailsType} speaker - The speaker object to update (mutated in place).
 * @param {string} value - The raw talk list string, e.g. "1 (5, 90), 4 (6, 20)".
 * @throws {TalksListParseError} If the input contains malformed text.
 */
export const updateSpeakerTalks = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  speaker.talks = parseSpeakerTalks(value);
};

/**
 * Converts the intermediate import/form representation into the database
 * structure of a visiting speaker.
 *
 * All mutable fields are wrapped in `{ value, updatedAt }` containers and
 * stamped with the current timestamp; the record is created as not deleted.
 *
 * @param {SpeakerIncomingDetailsType} incoming - The parsed speaker data to convert.
 * @param {string} congId - The LOCAL record id of the congregation
 *        (`speakers_congregations.id`) the speaker belongs to – not the
 *        remote congregation id used for syncing.
 * @param {string} [existingPersonUid] - Optional uid of an already existing
 *        person record. Pass it when the speaker belongs to the own
 *        congregation so the existing person is reused instead of creating
 *        a "ghost" record; a new random uid is generated when omitted.
 * @returns {VisitingSpeakerType} The speaker record ready to be persisted.
 */
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

      // map talks including their songs
      talks: incoming.talks.map((t) => ({
        talk_number: t.number,
        talk_songs: t.songs,
        _deleted: false,
        updatedAt: now,
      })),
    },
  };
};
