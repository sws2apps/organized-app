// src/utils/speakers.ts
import { generateDisplayName } from '@utils/common'; // Existiert laut deiner visiting_speakers.ts
import { VisitingSpeakerType } from '@definition/visiting_speakers'; // Pfad anpassen

// NEUER HILFSTYP für interne Verarbeitung
export type IncomingTalkType = {
  number: number;
  songs: number[];
};

// 1. Der "flache" Datentyp
export type SpeakerIncomingDetailsType = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  is_elder: boolean;
  is_ms: boolean;
  // ÄNDERUNG: Statt number[] speichern wir jetzt Objekte
  talks: IncomingTalkType[];
};

// 2. Factory
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

// 3. Modifier: Funktionen zum Bearbeiten

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

/**
 * PARSER FÜR DAS MUSTER: "1 (5, 90), 4 (6,20)"
 * Erkennt:
 * - "1" -> Vortrag 1, keine Lieder
 * - "1 (5)" -> Vortrag 1, Lied 5
 * - "1 (5, 90)" -> Vortrag 1, Lieder 5 und 90
 */
export const updateSpeakerTalks = (
  speaker: SpeakerIncomingDetailsType,
  value: string
): void => {
  const talksResult: IncomingTalkType[] = [];

  // Regex Erklärung:
  // (\d+)       -> Gruppe 1: Die Vortragsnummer (zwingend)
  // \s* -> Beliebige Leerzeichen
  // (?:         -> Beginn einer optionalen Gruppe (für die Lieder)
  //   \(        -> Eine echte öffnende Klammer
  //   ([^)]*)   -> Gruppe 2: Alles bis zur schließenden Klammer (die Lieder)
  //   \)        -> Eine echte schließende Klammer
  // )?          -> Die ganze Klammer-Gruppe ist optional
  const regex = /(\d+)\s*(?:\(([^)]*)\))?/g;

  let match;

  // Wir iterieren durch alle Treffer im String
  while ((match = regex.exec(value)) !== null) {
    const talkNum = parseInt(match[1], 10);

    // Lieder extrahieren (Gruppe 2), falls vorhanden
    let songs: number[] = [];
    if (match[2]) {
      songs = match[2]
        .split(/[,;]/) // Trennt Lieder bei Komma oder Semikolon
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0);
    }

    if (!isNaN(talkNum) && talkNum > 0) {
      talksResult.push({
        number: talkNum,
        songs: songs,
      });
    }
  }

  speaker.talks = talksResult;
};

// 4. Mapper Update
export const convertToDatabaseSpeaker = (
  incoming: SpeakerIncomingDetailsType,
  congId: string
): VisitingSpeakerType => {
  const now = new Date().toISOString();

  return {
    person_uid: crypto.randomUUID(),
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
