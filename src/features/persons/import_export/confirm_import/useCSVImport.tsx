import { useSetAtom } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { personsState } from '@states/persons';
import { dbPersonsSave } from '@services/dexie/persons';
import { personSchema } from '@services/dexie/schema';
import usePersonsImportConfig from './usePersonsImportConfig';
import { PersonType } from '@definition/person';
import { ImportResult } from './index.types';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { addPersonToGroupBySortIndex } from './field_service_group';
import { ImportResultGroups } from './index.types';
import appDb from '@db/appDb';
import { addGroupMembersToGroup } from './field_service_group';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';

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
    const translatedPaths = getPersonPathsTranslated().map((s) =>
      s.trim().toLowerCase()
    );

    // Checking whether all columns of the second line are included in the translated paths
    const allInTranslated = secondLineColumns.every((col) =>
      translatedPaths.includes(col.toLowerCase())
    );

    const startIndexData = allInTranslated ? 2 : 1;
    const dataLines = lines.slice(startIndexData);
    const headers = getCSVHeaders(csvText);

    const personsArray = dataLines
      .map((line) => {
        try {
          const cols = line.split(delimiter).map((c) => c.trim());
          if (cols.every((c) => c === '')) return null;

          const csvperson = structuredClone(personSchema);

          csvperson.person_uid = crypto.randomUUID();

          headers.forEach((header, index) => {
            if (index >= cols.length || cols[index] === '') return;

            const matchedField = PERSON_FIELD_META.find(
              (field) => field.key.toLowerCase() === header.toLowerCase()
            );

            if (matchedField) {
              const isSelected = selectedFields
                ? selectedFields[matchedField.key]
                : true;

              if (isSelected) {
                try {
                  matchedField.handler(csvperson, cols[index]);
                  if (matchedField.key === 'field_service_group') {
                    const sortIndex = parseInt(cols[index], 10) - 1; // groups are 0-indexed, but user see them as 1-indexed
                    if (sortIndex + 1) {
                      addPersonToGroupBySortIndex(
                        groupsArray,
                        csvperson.person_uid,
                        sortIndex
                      );
                    }
                  }
                } catch (error) {
                  console.error(`${header}:`, error);
                }
              }
            }
          });

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
    let errorReasonGroups = '';
    let successMembersCount = 0;
    let successCountGroups = 0;
    const totalCountGroups = importedGroups.length;
    const errorCounts = new Map<string, number>();

    if (!Array.isArray(importedGroups) || importedGroups.length === 0) {
      return {
        successMembersCount: 0,
        successCountGroups: 0,
        totalCountGroups: totalCountGroups,
        errorReasonGroups: '',
      };
    }

    //0. check new groups for existing persons, they have to exist in the db
    const existingPersons = await appDb.persons.toArray();
    const existingPersonUids = existingPersons.map((p) => p.person_uid);
    for (const group of importedGroups) {
      group.group_data.members = group.group_data.members.filter((member) =>
        existingPersonUids.includes(member.person_uid)
      );
    }
    importedGroups = importedGroups.filter(
      (g) => g.group_data.members.length > 0
    );

    //0b check whether there are still groups left
    if (importedGroups.length === 0) {
      return {
        successMembersCount: 0,
        successCountGroups: 0,
        totalCountGroups: totalCountGroups,
        errorReasonGroups: t('tr_groupsWithoutValidMembers'),
      };
    }

    // 1. get all current active groups
    const oldGroups = (await appDb.field_service_groups.toArray()).filter(
      (g) => !g.group_data._deleted
    );

    const existingGroupsIndex = new Set<number>();
    const newGroupsIndex = new Set<number>();

    //1b check whether there are members which are already in a group
    const allOldMembers = oldGroups.flatMap((g) => g.group_data.members);
    const allOldMemberUids = allOldMembers.map((m) => m.person_uid);
    for (const group of importedGroups) {
      group.group_data.members = group.group_data.members.filter(
        (member) => !allOldMemberUids.includes(member.person_uid)
      );
    }

    importedGroups = importedGroups.filter(
      (g) => g.group_data.members.length > 0
    );
    //1c check whether there are still groups left
    if (importedGroups.length === 0) {
      return {
        successMembersCount: 0,
        successCountGroups: 0,
        totalCountGroups: totalCountGroups,
        errorReasonGroups: t('tr_membersAlreadyInOtherGroups'),
      };
    }

    // 2. check importedGroups for already existing sort index

    for (const group of importedGroups) {
      if (
        oldGroups.some(
          (g) => g.group_data.sort_index === group.group_data.sort_index
        )
      ) {
        existingGroupsIndex.add(group.group_data.sort_index);
      } else {
        newGroupsIndex.add(group.group_data.sort_index);
      }
    }

    //3. edit existing groups
    if (existingGroupsIndex) {
      for (const existingIndex of existingGroupsIndex) {
        const oldGroup = oldGroups.find(
          (g) => g.group_data.sort_index === existingIndex
        );
        try {
          const addingMembers = importedGroups.find(
            (g) => g.group_data.sort_index === existingIndex
          ).group_data.members;
          addGroupMembersToGroup(oldGroup, addingMembers);
          await dbFieldServiceGroupSave(oldGroup);
          successMembersCount += addingMembers.length;
          successCountGroups++;
        } catch (error) {
          const errorMsg = String(error.message);
          errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
        }
      }
    }
    //4. add new groups
    if (newGroupsIndex) {
      const newGroupsIndexSorted = [...newGroupsIndex].sort((a, b) => a - b);
      const languageGroups = oldGroups.filter(
        (g) => g.group_data.language_group
      );
      const languageGroupsLength = languageGroups.length;
      let nextIndex = oldGroups.length - languageGroupsLength;
      //because language groups have to be at the end of the list, they will be updated later

      for (const newIndex of newGroupsIndexSorted) {
        try {
          const newGroup = importedGroups.find(
            (g) => g.group_data.sort_index === newIndex
          );
          newGroup.group_data.sort_index = nextIndex;
          newGroup.group_data.updatedAt = new Date().toISOString();
          await dbFieldServiceGroupSave(newGroup);
          successMembersCount += newGroup.group_data.members.length;
          nextIndex++;
          successCountGroups++;
        } catch (error) {
          const errorMsg = String(error.message);
          errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
        }
      }
      //5. update language groups sort index
      for (const group of languageGroups) {
        try {
          group.group_data.sort_index =
            group.group_data.sort_index + successCountGroups;
          await dbFieldServiceGroupSave(group);
        } catch (error) {
          const errorMsg = String(error.message);
          errorCounts.set(errorMsg, (errorCounts.get(errorMsg) ?? 0) + 1);
        }
      }
    }

    const errorMessages = Array.from(errorCounts.entries())
      .sort((a, b) => b[1] - a[1]) // at first the most frequent errors
      .map(([message, count]) => `${count} x ${message}`);

    errorReasonGroups = errorMessages.join('. ');

    return {
      successMembersCount,
      successCountGroups,
      totalCountGroups,
      errorReasonGroups,
    };
  };

  return {
    parseCsvToPersonsAndGroups,
    getCSVHeaders,
    addPersonsToDB,
    getPersonPathsTranslated,
    getPersonPaths,
    addGroupsToDB,
  };
};

export default useCSVImport;
