import { useAppTranslation } from '@hooks/index';
import useSpeakersImportConfig, {
  createEmptySpeakerDraft,
  SpeakerImportDraftType,
} from './useSpeakersImportConfig';
import { convertToDatabaseCongregation } from '@utils/congregations';
import { convertToDatabaseSpeaker } from '@utils/speakers';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import appDb from '@db/appDb';
import { dbSpeakersCongregationsCreate } from '@services/dexie/speakers_congregations';
//import { dbVisitingSpeakersUpdate } from '@services/dexie/visiting_speakers';
import Papa from 'papaparse';

// Rückgabetypen für den Speaker-Import definieren
export type SpeakerImportResult = {
  successCount: number;
  totalCount: number;
  errorReason: string;
  successfullyImported: VisitingSpeakerType[];
};

const useCSVImport = () => {
  const { t } = useAppTranslation();

  // 1. Konfiguration für Speaker nutzen
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const getSpeakerPaths = (): string[] => {
    return SPEAKER_FIELD_META.map((field) => field.key);
  };

  const getSpeakerPathsTranslated = (): string[] => {
    return SPEAKER_FIELD_META.map((field) => t(field.label));
  };

  const detectDelimiter = (csvText: string): string => {
    const { meta } = Papa.parse(csvText, {
      preview: 1,
      delimiter: '',
      skipEmptyLines: 'greedy',
    });
    return meta.delimiter ?? ',';
  };

  type MyRowType = Record<string, string>;

  // 2. Parsing-Funktion für Redner & Versammlungen
  const parseCsvToSpeakers = (
    csvText: string,
    selectedFields?: Record<string, boolean>
  ): {
    speakers: VisitingSpeakerType[];
    congregations: SpeakersCongregationsType[];
  } => {
    const parsed = Papa.parse<MyRowType>(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      delimiter: detectDelimiter(csvText),
      transformHeader: (header) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      console.error('CSV parsing errors:', parsed.errors);
    }

    // Check auf übersetzte Header in der zweiten Zeile (analog zu Persons)
    const translatedPaths = new Set(
      getSpeakerPathsTranslated().map((s) => s.trim().toLowerCase())
    );

    let dataRows = parsed.data;
    if (dataRows.length > 0) {
      const firstRow = dataRows[0] as Record<string, string>;
      const allInTranslated = Object.values(firstRow).every((col) =>
        translatedPaths.has(String(col).trim().toLowerCase())
      );
      if (allInTranslated) {
        dataRows = dataRows.slice(1);
      }
    }

    const headers = parsed.meta.fields || [];

    // Mapping erstellen: CSV-Header -> Config-Field
    const headerMapping = headers
      .map((header, originalIndex) => {
        const field = SPEAKER_FIELD_META.find(
          (field) => field.key.toLowerCase() === header.toLowerCase()
        );
        return { header, originalIndex, field };
      })
      .filter((item) =>
        selectedFields && item.field
          ? selectedFields[item.field.key]
          : !!item.field
      );

    const resultSpeakers: VisitingSpeakerType[] = [];
    const resultCongregations: SpeakersCongregationsType[] = [];

    // Iteration über alle Zeilen
    for (const row of dataRows) {
      try {
        // Leeres Draft-Objekt erstellen
        const draft: SpeakerImportDraftType = createEmptySpeakerDraft();

        // CSV-Daten in Draft füllen
        for (const mapping of headerMapping) {
          const value = row[mapping.header];
          if (!value || value.trim() === '') continue;

          try {
            mapping.field.handler(draft, value);
          } catch (error) {
            console.error(`Error handling field ${mapping.header}:`, error);
          }
        }

        // Validierung: Mindestanforderung (z.B. Nachname muss da sein)
        if (!draft.speaker.lastname) continue;

        // Umwandlung in Datenbank-Objekte
        const dbCongregation = convertToDatabaseCongregation(
          draft.congregation
        );

        // WICHTIG: Redner braucht die ID der Versammlung
        const dbSpeaker = convertToDatabaseSpeaker(
          draft.speaker,
          dbCongregation.id
        );

        resultCongregations.push(dbCongregation);
        resultSpeakers.push(dbSpeaker);
      } catch (error) {
        console.error('Row parsing error:', row, error);
      }
    }

    return { speakers: resultSpeakers, congregations: resultCongregations };
  };

  const getCSVHeaders = (csvText: string): string[] => {
    const parsed = Papa.parse(csvText, {
      header: true,
      preview: 1,
    });
    return parsed.meta.fields || [];
  };

  // 3. Datenbank-Speicherlogik
  const addSpeakersToDB = async (data: {
    speakers: VisitingSpeakerType[];
    congregations: SpeakersCongregationsType[];
  }): Promise<SpeakerImportResult> => {
    let errorReason = '';
    const successfullyImported: VisitingSpeakerType[] = [];
    let successCount = 0;

    if (!data.speakers || data.speakers.length === 0) {
      return {
        successCount: 0,
        totalCount: 0,
        errorReason: '',
        successfullyImported: [],
      };
    }

    const totalCount = data.speakers.length;
    const errorCounts = new Map<string, number>();

    // Cache für bereits existierende Versammlungen laden
    const existingCongs = await appDb.speakers_congregations.toArray();

    // Map für schnellen Zugriff: "Name|Nummer" -> ID
    const congMap = new Map<string, string>();
    existingCongs.forEach((c) => {
      const key = `${c.cong_data.cong_name.value}|${c.cong_data.cong_number.value}`;
      if (!c._deleted.value) congMap.set(key, c.id);
    });

    for (let i = 0; i < data.speakers.length; i++) {
      const speaker = data.speakers[i];
      const congregation = data.congregations[i];

      try {
        // SCHRITT 1: Versammlung behandeln
        // Prüfen, ob Versammlung schon existiert (anhand Name & Nummer)
        const congKey = `${congregation.cong_data.cong_name.value}|${congregation.cong_data.cong_number.value}`;
        let finalCongId = congMap.get(congKey);

        if (!finalCongId) {
          // Neu anlegen
          await dbSpeakersCongregationsCreate(congregation);
          finalCongId = congregation.id;
          congMap.set(congKey, finalCongId); // In Cache aufnehmen für nächste Zeile
        }

        // SCHRITT 2: Redner mit korrekter Versammlungs-ID verknüpfen
        speaker.speaker_data.cong_id = finalCongId;

        // Redner speichern (Update Logik nutzt put, daher create/update identisch)
        // Wir nutzen hier direkt Dexie put oder deine Service-Funktion
        // Achtung: dbVisitingSpeakersUpdate erwartet "UpdateSpec", hier speichern wir ganze Objekte.
        // Besser: appDb.visiting_speakers.put(speaker) direkt oder passende Service-Funktion bauen.
        await appDb.visiting_speakers.put(speaker);

        successfullyImported.push(speaker);
        successCount++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
      }
    }

    const errorMessages = Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([message, count]) => `${count} x ${message}`);

    errorReason = errorMessages.join('. ');

    return {
      successCount,
      totalCount,
      errorReason,
      successfullyImported,
    };
  };

  return {
    detectDelimiter,
    getCSVHeaders,
    getSpeakerPaths,
    getSpeakerPathsTranslated,
    parseCsvToSpeakers,
    addSpeakersToDB,
  };
};

export default useCSVImport;
