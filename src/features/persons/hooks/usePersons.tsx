import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import { formatDate } from '@services/dateformat';
import usePerson from './usePerson';

const usePersons = () => {
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

  const persons = useRecoilValue(personsActiveState);

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

    const result = persons.filter((record) => {
      const isMidweek = personIsMidweekStudent(record);
      if (isMidweek) return false;

      const firstReport = personGetFirstReport(record);

      if (firstReport > endMonth) return false;

      const history = [
        ...record.person_data.publisher_baptized.history,
        ...record.person_data.publisher_unbaptized.history,
      ].filter((record) => !record._deleted);

      if (history.length === 1 && history.at(0).end_date === null) {
        return false;
      }

      const inactive = history.some((data) => {
        if (data.start_date === null) return false;
        if (data.end_date === null) return false;

        const endTmp = new Date(data.end_date);

        const endTmpDate = formatDate(endTmp, 'yyyy/MM');

        return endTmpDate >= startMonth && endTmpDate <= endMonth;
      });

      return inactive;
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
