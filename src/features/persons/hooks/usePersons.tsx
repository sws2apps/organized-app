import { useAtomValue } from 'jotai';
import { personsActiveState } from '@states/persons';
import { addMonths, formatDate } from '@utils/date';
import usePerson from './usePerson';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { useMemo } from 'react';

const usePersons = (group?: string) => {
  const fieldGroups = useAtomValue(fieldWithLanguageGroupsState);

  const {
    personIsPublisher,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
    personIsEnrollmentActive,
    personIsMidweekStudent,
    personGetFirstReport,
    personIsEnrollmentYearActive,
    personIsPublisherYear,
  } = usePerson();

  const allPersons = useAtomValue(personsActiveState);

  const persons = useMemo(() => {
    if (!group || group === 'all') {
      return allPersons;
    }

    const foundGroup = fieldGroups.find((g) => g.group_id === group);

    if (!foundGroup) {
      return [];
    }

    return allPersons.filter((person) =>
      foundGroup.group_data.members.some(
        (personInGroup) => personInGroup.person_uid === person.person_uid
      )
    );
  }, [allPersons, fieldGroups, group]);

  const getPublishersActive = (month: string) => {
    const result = persons.filter((record) => {
      const isPublisher = personIsPublisher(record, month);
      return isPublisher;
    });

    return result;
  };

  const getPublishersInactive = (month: string) => {
    const result = persons.filter((record) => {
      const isMidweek = personIsMidweekStudent(record);
      if (isMidweek) return false;

      const firstReport = personGetFirstReport(record);
      if (firstReport > month) return false;

      const isPublisher = personIsPublisher(record, month);
      return !isMidweek && !isPublisher;
    });

    return result;
  };

  const getPublishersBaptized = (month: string) => {
    const result = persons.filter((record) => {
      const isBaptized = personIsBaptizedPublisher(record, month);
      return isBaptized;
    });

    return result;
  };

  const getPublishersUnbaptized = (month: string) => {
    const result = persons.filter((record) => {
      const isUnbaptized = personIsUnbaptizedPublisher(record, month);
      return isUnbaptized;
    });

    return result;
  };

  const getAppointedBrothers = (month: string) => {
    const result = persons.filter((record) => {
      const isElder = personIsPrivilegeActive(record, 'elder', month);
      if (isElder) return true;

      const isMS = personIsPrivilegeActive(record, 'ms', month);
      return isMS;
    });

    return result;
  };

  const getAuxiliaryPioneers = (month: string) => {
    const result = persons.filter((record) => {
      const isAP = personIsEnrollmentActive(record, 'AP', month);
      return isAP;
    });

    return result;
  };

  const getRegularPioneers = (month: string) => {
    const result = persons.filter((record) => {
      const isAP = personIsEnrollmentActive(record, 'FR', month);
      return isAP;
    });

    return result;
  };

  const getPublishersInactiveYears = (year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const result = persons.filter((person) => {
      const isMidweek = personIsMidweekStudent(person);
      if (isMidweek) return false;

      // get all histories with end date
      const history = [
        ...person.person_data.publisher_baptized.history,
        ...person.person_data.publisher_unbaptized.history,
      ].filter((record) => !record._deleted && record.start_date?.length > 0);

      const historyWithEndDate = history.filter(
        (record) => record.end_date?.length > 0
      );

      const isInactive = historyWithEndDate.some((record) => {
        const monthNext = formatDate(addMonths(record.end_date, 1), 'yyyy/MM');

        const isActive = history.some((active) => {
          const date = formatDate(new Date(active.start_date), 'yyyy/MM');

          return date === monthNext;
        });

        if (isActive) return false;

        return monthNext >= startMonth && monthNext <= endMonth;
      });

      return isInactive;
    });

    return result;
  };

  const getFTSYears = (year: string) => {
    const result = persons.filter((person) => {
      const isFMF = personIsEnrollmentYearActive(person, 'FMF', year);
      const isFR = personIsEnrollmentYearActive(person, 'FR', year);
      const isFS = personIsEnrollmentYearActive(person, 'FS', year);

      return isFMF || isFR || isFS;
    });

    return result;
  };

  const getFTSMonths = (month: string) => {
    const result = persons.filter((person) => {
      const isFMF = personIsEnrollmentActive(person, 'FMF', month);
      const isFR = personIsEnrollmentActive(person, 'FR', month);
      const isFS = personIsEnrollmentActive(person, 'FS', month);

      return isFMF || isFR || isFS;
    });

    return result;
  };

  const getAPYears = (year: string) => {
    const result = persons.filter((person) => {
      const isAP = personIsEnrollmentYearActive(person, 'AP', year);

      return isAP;
    });

    return result;
  };

  const getAPMonths = (month: string) => {
    const result = persons.filter((person) => {
      const isAP = personIsEnrollmentActive(person, 'AP', month);
      return isAP;
    });

    return result;
  };

  const getPublisherYears = (year: string) => {
    const result = persons.filter((person) => {
      const isFMF = personIsEnrollmentYearActive(person, 'FMF', year);
      const isFR = personIsEnrollmentYearActive(person, 'FR', year);
      const isFS = personIsEnrollmentYearActive(person, 'FS', year);
      const isAP = personIsEnrollmentYearActive(person, 'AP', year);

      if (isFMF || isFR || isFS || isAP) return false;

      const isPublisher = personIsPublisherYear(person, year);
      return isPublisher;
    });

    return result;
  };

  const getPublisherMonths = (month: string) => {
    const result = persons.filter((person) => {
      const isFMF = personIsEnrollmentActive(person, 'FMF', month);
      const isFR = personIsEnrollmentActive(person, 'FR', month);
      const isFS = personIsEnrollmentActive(person, 'FS', month);
      const isAP = personIsEnrollmentActive(person, 'AP', month);

      if (isFMF || isFR || isFS || isAP) return false;

      const isPublisher = personIsPublisher(person, month);
      return isPublisher;
    });

    return result;
  };

  const getPublisherAllYears = (year: string) => {
    const result = persons.filter((person) => {
      const isPublisher = personIsPublisherYear(person, year);
      return isPublisher;
    });

    return result;
  };

  return {
    getPublishersActive,
    getPublishersInactive,
    getPublishersBaptized,
    getPublishersUnbaptized,
    getAppointedBrothers,
    getAuxiliaryPioneers,
    getRegularPioneers,
    getPublishersInactiveYears,
    getFTSYears,
    getFTSMonths,
    getAPYears,
    getAPMonths,
    getPublisherYears,
    getPublisherMonths,
    getPublisherAllYears,
  };
};

export default usePersons;
