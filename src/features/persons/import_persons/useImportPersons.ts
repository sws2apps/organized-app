import {
  PersonType,
  isPrivilegeType,
  isEnrollmentType,
  ALL_ENROLLMENT_TYPES,
  ALL_PRIVILEGE_TYPES,
} from '@definition/person';
import { AssignmentCode } from '@definition/assignment';
import { useAtomValue, useSetAtom } from 'jotai';
import { dbPersonsSave } from '@services/dexie/persons';
import { ChangeEvent } from 'react';
import { personsState } from '@states/persons';
import {
  changeFirstname,
  changeLastname,
  toggleGender,
  changeBirthDate,
  changeEmailAddress,
  changePhone,
  changeAddress,
} from '@utils/person';
import { userDataViewState } from '@states/settings';
import { languageGroupsState } from '@states/field_service_groups';
import {
  toggleMidweekMeetingStudent,
  midweekMeetingStudentStartDateChange,
  toggleUnbaptizedPublisher,
  toggleBaptizedPublisher,
  changeBaptismDate,
  toggleActive,
} from '@utils/spiritual_status';
import { toggleAssignment } from '@utils/assignments';
import {
  privilegesAddHistory,
  privilegeStartDateChange,
  privilegeChange,
} from '@utils/privileges';
import {
  enrollmentChange,
  enrollmentsAddHistory,
  enrollmentStartDateChange,
} from '@utils/enrollments';
import { useAppTranslation } from '@hooks/index';
import useAssignments from '@features/persons/assignments/useAssignments';
import { displaySnackNotification } from '@services/states/app';

import { personSchema } from '@services/dexie/schema';

const usePersonsImport = () => {
  const { t } = useAppTranslation();

  const { getAssignmentName } = useAssignments();
  const dataView = useAtomValue(userDataViewState);
  const languageGroups = useAtomValue(languageGroupsState);

  const languageGroupsIds = languageGroups.map((group) => group.group_id);

  const newPerson = structuredClone(personSchema);
  newPerson.person_uid = crypto.randomUUID();

  const setPersons = useSetAtom(personsState);

  const handlers: Record<string, (p: PersonType, value: string) => void> = {
    // for the correct translation in the csv template it is important that the part after 'person_data.' is correspending to the translation variable like date -> tr_date
    'person_data.firstname': (p, v) => changeFirstname(p, v),
    'person_data.lastname': (p, v) => changeLastname(p, v),
    'person_data.male': (p, v) => toggleGender(p, convertValue(v, 'gender')),
    'person_data.dateOfBirth': (p, v) =>
      changeBirthDate(p, convertValue(v, 'date')),
    'person_data.emailAddress': (p, v) => changeEmailAddress(p, v),
    'person_data.address': (p, v) => changeAddress(p, v),
    'person_data.phoneNumber': (p, v) => changePhone(p, v),
    'person_data.midweekMeetingStudent': (p, v) =>
      toggleMidweekMeetingStudent(p, convertValue(v, 'boolean'), true),
    'person_data.midweekMeetingStudent.startDate': (p, v) =>
      midweekMeetingStudentStartDateChange(
        p,
        undefined,
        convertValue(v, 'date')
      ),
    'person_data.baptized': (p, v) =>
      toggleBaptizedPublisher(p, convertValue(v, 'boolean'), true),
    'person_data.baptismDate': (p, v) =>
      changeBaptismDate(p, convertValue(v, 'date')),
    'person_data.unbaptizedPublisher': (p, v) =>
      toggleUnbaptizedPublisher(p, convertValue(v, 'boolean'), true),
    'person_data.activePublisher': (p, v) =>
      toggleActive(p, convertValue(v, 'boolean')),
  };

  const getAssignmentPaths = () => {
    return Object.keys(AssignmentCode)
      .filter((key) => isNaN(Number(key)))
      .filter((key) => getAssignmentName(key) !== key) // only keys with translation-variable
      .map((key) => `assignments.${key}`);
  };

  const getPersonPaths = (): string[] => {
    const personPropertiesPaths = Object.keys(handlers);
    const privilegePaths: string[] = ALL_PRIVILEGE_TYPES.map(
      (privilege) => `privilege.${privilege}`
    );
    const enrollmentPaths: string[] = ALL_ENROLLMENT_TYPES.map(
      (enrollment) => `enrollment.${enrollment}`
    );
    return [
      ...personPropertiesPaths,
      ...privilegePaths,
      ...enrollmentPaths,
      ...getAssignmentPaths(),
    ];
  };

  const convertValue = (value: string, targetType: string) => {
    if (value === '' || value === null) return null;

    if (targetType === 'boolean')
      return ['true', '1'].includes(value.toLowerCase());

    if (targetType === 'number') {
      const num = Number(value);
      return isNaN(num) ? null : num;
    }

    if (targetType === 'object') {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }

    if (targetType === 'gender') {
      return ['true', '1'].includes(value.toLowerCase()) ? 'male' : 'female';
    }

    if (targetType === 'date') {
      const parsedDate = new Date(value);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    return value;
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

  const handleAssignment = (
    assignmentKey: string,
    assignmentValue: string,
    csvperson: PersonType,
    dataView: string,
    languageGroupsIds: string[]
  ) => {
    const assignmentCode =
      AssignmentCode[assignmentKey as keyof typeof AssignmentCode];
    if (
      assignmentCode &&
      ['1', 'true'].includes(assignmentValue.toLowerCase())
    ) {
      toggleAssignment(
        csvperson,
        true,
        assignmentCode,
        dataView,
        languageGroupsIds
      );
    }
  };

  const handlePrivilege = (
    privilegeName: string,
    privilegeValue: string,
    csvperson: PersonType
  ) => {
    if (
      Array.isArray(csvperson.person_data.privileges) &&
      csvperson.person_data.privileges.length === 0
    ) {
      if (
        isPrivilegeType(privilegeName) &&
        ['1', 'true'].includes(privilegeValue.toLowerCase())
      ) {
        privilegesAddHistory(csvperson);
        if (
          Array.isArray(csvperson.person_data.privileges) &&
          csvperson.person_data.privileges.length !== 0
        ) {
          privilegeChange(
            csvperson,
            csvperson.person_data.privileges[0].id,
            privilegeName
          );
        }
      }
    }
    if (
      Array.isArray(csvperson.person_data.privileges) &&
      csvperson.person_data.privileges.length !== 0 &&
      privilegeName === 'start_date'
    ) {
      privilegeStartDateChange(
        csvperson,
        csvperson.person_data.privileges[0].id,
        convertValue(privilegeValue.toLowerCase(), 'date')
      );
    }
  };

  const handleEnrollment = (
    enrollmentType: string,
    enrollmentValue: string,
    csvperson: PersonType
  ) => {
    if (
      Array.isArray(csvperson.person_data.enrollments) &&
      csvperson.person_data.enrollments.length === 0
    ) {
      if (
        isEnrollmentType(enrollmentType) &&
        ['1', 'true'].includes(enrollmentValue.toLowerCase())
      ) {
        enrollmentsAddHistory(csvperson);
        enrollmentChange(
          csvperson,
          csvperson.person_data.enrollments[0].id,
          enrollmentType
        );
      }
    }
    if (
      csvperson.person_data.enrollments[0].id !== undefined &&
      enrollmentType === 'start_date'
    ) {
      enrollmentStartDateChange(
        csvperson,
        csvperson.person_data.enrollments[0].id,
        convertValue(enrollmentValue.toLowerCase(), 'date')
      );
    }
  };

  const parseCsvToPersons = (csvText: string): PersonType[] => {
    const delimiter = detectDelimiter(csvText);

    // 2. Generating all possible property paths for PersonType
    const personPaths = getPersonPaths();

    // 3. CSV processing with detected delimiter
    const lines = csvText.trim().split('\n');

    // Testing whether the first dataline is the tranlation of the headers
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

    const headerLine = lines[0];
    const dataLines = lines.slice(startIndexData);

    const headers = headerLine
      .split(delimiter)
      .map((h) => h.trim().toLowerCase());

    // 4. Mapping between CSV headers and PersonType paths
    const headerMap = new Map<string, string>();
    headers.forEach((header) => {
      const matchedPath = personPaths.find(
        (path) => path.toLowerCase() === header.toLowerCase()
      );
      if (matchedPath) headerMap.set(header, matchedPath);
    });

    // 5. Processing CSV rows
    return dataLines
      .map((line) => {
        try {
          const cols = line.split(delimiter).map((c) => c.trim());
          if (cols.every((c) => c === '')) return null;

          const csvperson = structuredClone(personSchema);
          csvperson.person_uid = crypto.randomUUID();
          // 6. Assign values from CSV
          headers.forEach((header, index) => {
            const path = headerMap.get(header);
            if (!path || index >= cols.length || cols[index] === '') return;
            const pathParts = path.split('.');

            switch (pathParts[0]) {
              case 'assignments': {
                handleAssignment(
                  pathParts[1],
                  cols[index],
                  csvperson,
                  dataView,
                  languageGroupsIds
                );
                break;
              }

              case 'privilege': {
                handlePrivilege(pathParts[1], cols[index], csvperson);
                break;
              }

              case 'enrollment': {
                handleEnrollment(pathParts[1], cols[index], csvperson);
                break;
              }

              default: {
                const value = cols[index];
                const handler = handlers[path];
                if (handler) {
                  handler(csvperson, value);
                }
              }
            }
          });

          return csvperson;
        } catch (error) {
          console.error('Fehler beim Parsen der Zeile:', line, error);
          return null;
        }
      })
      .filter((csvperson): csvperson is PersonType => csvperson !== null);
  };

  const onPersonsParsed = async (importedPersons: PersonType[]) => {
    let errorReason = '';
    const successfullyImported: PersonType[] = [];
    let successCount = 0;

    if (!Array.isArray(importedPersons) || importedPersons.length === 0) return;

    const uuidTracker = new Set<string>();

    for (const person of importedPersons) {
      try {
        if (uuidTracker.has(person.person_uid)) {
          console.error('UUID-Kollision:', person.person_uid);
          continue;
        }
        uuidTracker.add(person.person_uid);

        await dbPersonsSave(person, true);
        successfullyImported.push(person);
        successCount++;
      } catch (error) {
        errorReason = String(error);
        console.error('Fehler beim Speichern:', error);
      }
    }

    // 4. State-Update with duplicate checking
    setPersons((prev) => {
      const existingUids = new Set(prev.map((p) => p.person_uid));
      const newPersons = successfullyImported.filter(
        (p) => !existingUids.has(p.person_uid)
      );
      return [...prev, ...newPersons];
    });

    if (Array.isArray(importedPersons) && importedPersons.length !== 0) {
      displaySnackNotification({
        header: t('tr_personAdded'),
        message:
          t('tr_importSuccess', {
            successCount,
            totalCount: importedPersons.length,
          }) + errorReason,
        severity: successCount === importedPersons.length ? 'success' : 'error',
      });
    }
  };

  const handleCsvImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const persons = parseCsvToPersons(text);

      onPersonsParsed(persons);
    };
    reader.readAsText(file);
  };

  //starting from here functions for csv template
  const getCSVDelimiterByNumberFormat = (): string => {
    // Check the decimal separator of the current locale
    const numberFormatter = new Intl.NumberFormat();
    const formattedNumber = numberFormatter.format(1.1);

    // If comma is used as the decimal separator, use semicolon for CSV
    return formattedNumber.includes(',') ? ';' : ',';
  };

  const getPersonPathsTranslated = (): string[] => {
    const columnNames = getPersonPaths();

    // Retrieve column names dynamically from getPersonPaths()
    const columnNamesDirectTranslation = columnNames.filter(
      (path) => !path.startsWith('assignments.')
    );
    const columnNamesAssignments = columnNames.filter((path) =>
      path.startsWith('assignments.')
    );

    const columnNamesForDirectTranslation = columnNamesDirectTranslation.map(
      (path) => {
        const afterLastDot = path.includes('.')
          ? path.split('.').pop() || path
          : path;
        return afterLastDot === 'ms' ? 'ministerialServant' : afterLastDot;
      }
    );

    const assignmentColumnsTranslated = columnNamesAssignments.map((path) => {
      const afterLastDot = path.includes('.')
        ? path.split('.').pop() || path
        : path;

      return getAssignmentName(afterLastDot);
    });

    const columnsTranslated = [
      ...columnNamesForDirectTranslation.map((column) => t(`tr_${column}`)),
      ...assignmentColumnsTranslated,
    ];
    return columnsTranslated;
  };

  const handleDownloadTemplate = () => {
    const columnNames = getPersonPaths();
    const columnsTranslated = getPersonPathsTranslated();

    const csvRows = [
      columnNames.join(getCSVDelimiterByNumberFormat()),
      columnsTranslated.join(getCSVDelimiterByNumberFormat()),
    ];
    // Adding BOM (Byte Order Mark) for Excel compatibility
    const csvContent = '\ufeff' + csvRows.join('\n');

    // Execute download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'persons_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return {
    handleCsvImport,
    handlers,
    handleDownloadTemplate,
  };
};

export default usePersonsImport;
