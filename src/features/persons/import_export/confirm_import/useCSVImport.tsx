import { useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { personsState } from '@states/persons';
import { dbPersonsSave } from '@services/dexie/persons';
import { personSchema } from '@services/dexie/schema';
import usePersonsImportConfig from './usePersonsImportConfig';
import { PersonType } from '@definition/person';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { ImportResult, ImportResultGroups } from './index.types';
import {
  addPersonToGroupBySortIndex,
  addGroupMembersToGroup,
} from './field_service_group';
import appDb from '@db/appDb';
import { dbFieldServiceGroupBulkSave } from '@services/dexie/field_service_groups';
import Papa from 'papaparse';

const useCSVImport = () => {
  const { t } = useAppTranslation();
  const { PERSON_FIELD_META } = usePersonsImportConfig();
  const setPersons = useSetAtom(personsState);

  const getPersonPaths = (): string[] => {
    return PERSON_FIELD_META.map((field) => field.key);
  };

  const detectDelimiter = (csvText: string): string => {
    const delimiters = [',', ';', '\t'];
    const lines = csvText.trim().split('\n');

    const sampleLines = lines.slice(0, Math.min(5, lines.length));

    let bestDelimiter = ',';
    let maxScore = 0;

    for (const delimiter of delimiters) {
      let score = 0;
      const columnCounts: number[] = [];

      for (const line of sampleLines) {
        const columns = line.split(delimiter);
        columnCounts.push(columns.length);

        if (columns.length > 1) {
          score += columns.length;
        }
      }

      // checking whether all lines have the same number of columns
      const uniqueCounts = [...new Set(columnCounts)];
      if (uniqueCounts.length === 1 && uniqueCounts[0] > 1) {
        score *= 2; // Bonus for consistency
      }

      if (score > maxScore) {
        maxScore = score;
        bestDelimiter = delimiter;
      }
    }

    return bestDelimiter;
  };

  /*   const getCSVHeadersX = (csvText: string): string[] => {
    const delimiter = detectDelimiter(csvText);
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];
    const headers = lines[0].split(delimiter).map((h) => h.trim());
    return headers;
  }; */

  type MyRowType = Record<string, string>;

  const parseCsvToPersonsAndGroups = (
    csvText: string,
    selectedFields?: Record<string, boolean>
  ): [PersonType[], FieldServiceGroupType[]] => {
    const parsed = Papa.parse<MyRowType>(csvText, {
      header: true,
      skipEmptyLines: 'greedy',
      delimiter: detectDelimiter(csvText),
      transformHeader: (header) => header.trim(),
    });

    if (parsed.errors.length > 0) {
      console.error('CSV parsing errors:', parsed.errors);
    }

    const groupsArray: FieldServiceGroupType[] = [];

    // Check if second row (first data row) contains translations
    const translatedPaths = new Set(
      getPersonPathsTranslated().map((s) => s.trim().toLowerCase())
    );

    let dataRows = parsed.data;
    if (dataRows.length > 0) {
      const firstRow = dataRows[0] as Record<string, string>;
      const allInTranslated = Object.values(firstRow).every((col) =>
        translatedPaths.has(String(col).trim().toLowerCase())
      );
      if (allInTranslated) {
        dataRows = dataRows.slice(1); // Skip translation row
      }
    }

    const headers = parsed.meta.fields || [];
    const headerMapping = headers
      .map((header, originalIndex) => {
        const field = PERSON_FIELD_META.find(
          (field) => field.key.toLowerCase() === header.toLowerCase()
        );
        return { header, originalIndex, field };
      })
      .filter((item) =>
        selectedFields && item.field
          ? selectedFields[item.field.key]
          : !!item.field
      );

    const personsArray = dataRows
      .map((row: Record<string, string>) => {
        try {
          const csvperson = structuredClone(personSchema);
          csvperson.person_uid = crypto.randomUUID();
          const idMidweekMeetingStudent =
            csvperson.person_data.midweek_meeting_student.history[0]?.id ??
            null;
          csvperson.person_data.midweek_meeting_student.active.value = false;
          csvperson.person_data.midweek_meeting_student.history =
            csvperson.person_data.midweek_meeting_student.history.filter(
              (h) => h.id !== idMidweekMeetingStudent
            );
          // the schema contains one history entry by default for midweek meeting student, but the user may be irritated if there is not selected this data_field

          for (const mapping of headerMapping) {
            const value = row[mapping.header];
            if (!value || value.trim() === '') continue;

            try {
              mapping.field.handler(csvperson, value);
              if (mapping.field.key === 'field_service_group') {
                const sortIndex = Number.parseInt(value, 10) - 1;
                if (sortIndex + 1 > 0) {
                  addPersonToGroupBySortIndex(
                    groupsArray,
                    csvperson.person_uid,
                    sortIndex
                  );
                }
              }
            } catch (error) {
              console.error(`${mapping.header}:`, error);
            }
          }

          return csvperson;
        } catch (error) {
          console.error(row, error);
          return null;
        }
      })
      .filter((csvperson): csvperson is PersonType => csvperson !== null);

    return [personsArray, groupsArray];
  };

  // Update getCSVHeaders to use papaparse
  const getCSVHeaders = (csvText: string): string[] => {
    const parsed = Papa.parse(csvText, {
      header: true,
      preview: 1, // Only parse first row for headers
    });
    return parsed.meta.fields || [];
  };
  const getPersonPathsTranslated = (): string[] => {
    return PERSON_FIELD_META.map((field) => {
      return t(field.label);
    });
  };

  const addPersonsToDB = async (
    importedPersons: PersonType[]
  ): Promise<ImportResult> => {
    let errorReason = '';
    const successfullyImported: PersonType[] = [];
    let successCount = 0;
    let totalCount = 0;

    if (!Array.isArray(importedPersons) || importedPersons.length === 0) {
      return {
        successCount: 0,
        totalCount: 0,
        errorReason: '',
        successfullyImported: [],
      };
    }
    const errorCounts = new Map<string, number>();

    totalCount = importedPersons.length;
    const uuidTracker = new Set<string>();

    for (const person of importedPersons) {
      try {
        if (uuidTracker.has(person.person_uid)) {
          console.error('UUID-collision:', person.person_uid);
          const errorMsg = 'UUID-collision';
          errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
          continue;
        }
        uuidTracker.add(person.person_uid);

        await dbPersonsSave(person, true);
        successfullyImported.push(person);
        successCount++;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
      }
    }

    // State-Update with duplicate checking
    setPersons((prev) => {
      const existingUids = new Set(prev.map((p) => p.person_uid));
      const newPersons = successfullyImported.filter(
        (p) => !existingUids.has(p.person_uid)
      );
      return [...prev, ...newPersons];
    });

    const errorMessages = Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Häufigste Fehler zuerst
      .map(([message, count]) => `${count} x ${message}`);

    errorReason = errorMessages.join('. ');
    return {
      successCount,
      totalCount,
      errorReason,
      successfullyImported,
    };
  };

  const addGroupsToDB = async (
    importedGroups: FieldServiceGroupType[]
  ): Promise<ImportResultGroups> => {
    let successMembersCount = 0;
    let successCountGroups = 0;
    const totalCountGroups = importedGroups.length;
    let errorReasonGroups = '';
    if (!Array.isArray(importedGroups) || importedGroups.length === 0) {
      return {
        successMembersCount: 0,
        successCountGroups: 0,
        totalCountGroups: totalCountGroups,
        errorReasonGroups: '',
      };
    }

    const existingPersons = await appDb.persons.toArray();
    const existingPersonUids = new Set<string>();
    for (const person of existingPersons) {
      existingPersonUids.add(person.person_uid);
    }
    const allOldGroups = await appDb.field_service_groups.toArray();
    const activeOldGroups = allOldGroups.filter((g) => !g.group_data._deleted);

    const languageGroups = activeOldGroups.filter(
      (g) => g.group_data.language_group
    );
    let nextIndex = activeOldGroups.length - languageGroups.length;
    //because language groups have to be at the end of the list

    const relevantImportGroups = importedGroups
      .filter((g) =>
        g.group_data.members.some((m) => existingPersonUids.has(m.person_uid))
      )
      .sort((a, b) => a.group_data.sort_index - b.group_data.sort_index);
    successCountGroups = relevantImportGroups.length;

    const updatedGroups = [];
    for (const importGroup of relevantImportGroups) {
      //adding group if not existing
      const existingGroup = activeOldGroups.find(
        (oldG) =>
          oldG.group_data.sort_index === importGroup.group_data.sort_index
      );

      const newExistingMembers = importGroup.group_data.members.filter((m) =>
        existingPersonUids.has(m.person_uid)
      );

      successMembersCount += newExistingMembers.length;

      if (existingGroup) {
        addGroupMembersToGroup(existingGroup, newExistingMembers);
        updatedGroups.push(existingGroup);
      } else {
        importGroup.group_data.sort_index = nextIndex;
        importGroup.group_data.updatedAt = new Date().toISOString();
        updatedGroups.push(importGroup);
        nextIndex++;
      }
    }
    for (const group of languageGroups) {
      group.group_data.sort_index += nextIndex;
      nextIndex++;
    }

    try {
      await dbFieldServiceGroupBulkSave(updatedGroups);
    } catch (error) {
      errorReasonGroups =
        error instanceof Error ? error.message : String(error);
    }

    return {
      successMembersCount: successMembersCount,
      successCountGroups: successCountGroups,
      totalCountGroups: totalCountGroups,
      errorReasonGroups: errorReasonGroups,
    };
  };

  return {
    detectDelimiter,
    parseCsvToPersonsAndGroups,
    getCSVHeaders,
    addPersonsToDB,
    getPersonPathsTranslated,
    getPersonPaths,
    addGroupsToDB,
  };
};

export default useCSVImport;
