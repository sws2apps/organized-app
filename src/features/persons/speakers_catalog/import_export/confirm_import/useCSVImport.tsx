import { useAppTranslation } from '@hooks/index';
import useSpeakersImportConfig, {
  SpeakerImportDraftType,
} from './useSpeakersImportConfig';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { CongregationIncomingDetailsType } from '@definition/speakers_congregations';
import appDb from '@db/appDb';
import { dbSpeakersCongregationsCreate } from '@services/dexie/speakers_congregations';
//import { dbVisitingSpeakersUpdate } from '@services/dexie/visiting_speakers';
import Papa from 'papaparse';
import { createEmptyCongregation } from '@utils/congregations';
import {
  createEmptySpeaker,
  SpeakerIncomingDetailsType,
} from '@utils/speakers';
import { convertToDatabaseCongregation } from '@utils/congregations';
import { convertToDatabaseSpeaker } from '@utils/speakers';

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
  const parseCsvToSpeakersAndCongs = (
    csvText: string,
    selectedFields?: Record<string, boolean>
  ): {
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
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

    const resultSpeakers: SpeakerIncomingDetailsType[] = [];
    const resultCongregations: CongregationIncomingDetailsType[] = [];
    const defaultCongregation = createEmptyCongregation();
    defaultCongregation.cong_name = 'OwnCongregation';
    let currentCongregation = defaultCongregation;

    // Iteration über alle Zeilen
    for (const row of dataRows) {
      try {
        // Leeres Draft-Objekt erstellen
        if (row['congregation.cong_name']) {
          currentCongregation = createEmptyCongregation();
        }
        // Congregation wird dann durch handler gefüllt

        const speaker = createEmptySpeaker();
        const draft: SpeakerImportDraftType = {
          congregation: currentCongregation,
          speaker: speaker,
        };

        // CSV-Daten in Draft füllen
        for (const mapping of headerMapping) {
          const value = row[mapping.header];
          if (!value || value.trim() === '') continue;

          try {
            mapping.field?.handler(draft, value);
          } catch (error) {
            console.error(`Error handling field ${mapping.header}:`, error);
          }
        }

        // Validierung: Mindestanforderung (z.B. Nachname muss da sein)
        if (!draft.speaker.lastname) continue;

        // Umwandlung in Datenbank-Objekte
        //Es macht kein Sinn das jetzt schon umzuwandeln, manche Versammlungen bestehen evtl. schon
        /*         const dbCongregation = convertToDatabaseCongregation(
          draft.congregation
        );

        // WICHTIG: Redner braucht die ID der Versammlung
        const dbSpeaker = convertToDatabaseSpeaker(
          draft.speaker,
          dbCongregation.id
        ); */

        resultCongregations.push(draft.congregation);
        resultSpeakers.push(draft.speaker);
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
    speakers: SpeakerIncomingDetailsType[];
    congregations: CongregationIncomingDetailsType[];
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
    const existingVisitingSpeakers = await appDb.visiting_speakers.toArray();
    const settings = await appDb.app_settings.get(1);
    if (!settings) {
      return {
        successCount: 0,
        totalCount,
        errorReason: 'Settings not found',
        successfullyImported: [],
      };
    }
    //const ownCongCountryCode = settings.cong_settings.country_code;
    const ownCongName = settings.cong_settings.cong_name;

    // Map für schnellen Zugriff: "Name|Nummer" -> ID
    //IMPORTANT:Is it possible that there are two congregations with the same name in different countries? If yes, we should include country code in the key as well. For now, we assume name is unique.
    const congMap = new Map<string, string>();
    existingCongs.forEach((c) => {
      const key = `${c.cong_data.cong_name.value}`;
      if (!c._deleted.value) congMap.set(key, c.id);
    });

    const existingSpeakerKeys = new Set(
      existingVisitingSpeakers.map(
        (s) =>
          `${s.speaker_data.cong_id}|${s.speaker_data.person_firstname.value}|${s.speaker_data.person_lastname.value}`
      )
    );

    for (let i = 0; i < data.speakers.length; i++) {
      const speaker = data.speakers[i];
      const congregation = data.congregations[i];
      congregation.cong_name =
        congregation.cong_name === 'OwnCongregation'
          ? ownCongName
          : congregation.cong_name;

      try {
        const congKey = `${congregation.cong_name}`;
        let finalCongId = congMap.get(congKey);
        if (finalCongId) {
          const existingCong = existingCongs.find((c) => c.id === finalCongId);
          const isSynced =
            existingCong?.cong_data?.cong_id &&
            existingCong.cong_data.cong_id.length > 0;

          if (isSynced) {
            const errorMsg = t('tr_congregationAlreadySynced'); // besserer Key
            errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
            continue;
          }
        }

        if (!finalCongId) {
          // creating new congregation if it doesn't exist yet
          const newCong = convertToDatabaseCongregation(congregation);
          await dbSpeakersCongregationsCreate(newCong);
          finalCongId = newCong.id;
          congMap.set(congKey, finalCongId);
        }

        const speakerKey = `${finalCongId}|${speaker.firstname}|${speaker.lastname}`;
        if (existingSpeakerKeys.has(speakerKey)) {
          const errorMsg = t('tr_speakerAlreadyExists'); // oder ähnlicher Key
          errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
          continue;
        } // currently only adding new speakers, no update logic

        const finalSpeaker = convertToDatabaseSpeaker(speaker, finalCongId);

        // Redner speichern (Update Logik nutzt put, daher create/update identisch)
        // Wir nutzen hier direkt Dexie put oder deine Service-Funktion
        // Achtung: dbVisitingSpeakersUpdate erwartet "UpdateSpec", hier speichern wir ganze Objekte.
        // Besser: appDb.visiting_speakers.put(speaker) direkt oder passende Service-Funktion bauen.
        await appDb.visiting_speakers.put(finalSpeaker);

        successfullyImported.push(finalSpeaker);
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
    parseCsvToSpeakersAndCongs,
    addSpeakersToDB,
  };
};

export default useCSVImport;
