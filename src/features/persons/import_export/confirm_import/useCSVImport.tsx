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

  const getCSVHeaders = (csvText: string): string[] => {
    const delimiter = detectDelimiter(csvText);
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];
    const headers = lines[0].split(delimiter).map((h) => h.trim());
    return headers;
  };

  const parseCsvToPersonsAndGroups = (
    csvText: string,
    selectedFields?: Record<string, boolean>
  ): [PersonType[], FieldServiceGroupType[]] => {
    const delimiter = detectDelimiter(csvText);
    const lines = csvText.trim().split('\n');
    const groupsArray: FieldServiceGroupType[] = [];

    // Testing whether the first dataline is the translation of the headers
    const secondLine = lines[1];
    const secondLineColumns = secondLine
      .split(delimiter)
      .map((col) => col.trim());
    const translatedPaths = new Set(
      getPersonPathsTranslated().map((s) => s.trim().toLowerCase())
    );

    // Checking whether all columns of the second line are included in the translated paths
    const allInTranslated = secondLineColumns.every((col) =>
      translatedPaths.has(col.toLowerCase())
    );

    const startIndexData = allInTranslated ? 2 : 1;
    const dataLines = lines
      .slice(startIndexData)
      .filter((line) =>
        line.split(delimiter).some((cell) => cell.trim() !== '')
      );
    const allHeaders = getCSVHeaders(csvText);

    //only keep headers which are selected, but keep original index for correct mapping of columns later
    const headerMapping = allHeaders
      .map((header, originalIndex) => {
        const field = PERSON_FIELD_META.find(
          (field) => field.key.toLowerCase() === header.toLowerCase()
        );
        return { header, originalIndex, field };
      })
      .filter((item) =>
        selectedFields ? selectedFields[item.field.key] : true
      );

    const personsArray = dataLines
      .map((line) => {
        try {
          const csvperson = structuredClone(personSchema);
          csvperson.person_uid = crypto.randomUUID();
          const cols = line.split(delimiter).map((c) => c.trim());

          for (const mapping of headerMapping) {
            const value = cols[mapping.originalIndex];
            if (!value || value.trim() === '') continue;

            try {
              mapping.field.handler(csvperson, value);
              if (mapping.field.key === 'field_service_group') {
                const sortIndex = Number.parseInt(value, 10) - 1; // groups are 0-indexed, but user see them as 1-indexed

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
          console.error(line, error);
          return null;
        }
      })
      .filter((csvperson): csvperson is PersonType => csvperson !== null);

    return [personsArray, groupsArray];
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
        const errorMsg = String(error.message);
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
      errorReasonGroups = String(error.message);
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
