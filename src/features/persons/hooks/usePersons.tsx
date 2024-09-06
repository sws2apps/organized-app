import { useRecoilValue } from 'recoil';
import { personsActiveState } from '@states/persons';
import { formatDate } from '@services/dateformat';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { PersonType } from '@definition/person';
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
    personCheckInactivityState,
  } = usePerson();

  const persons = useRecoilValue(personsActiveState);
  const reports = useRecoilValue(congFieldServiceReportsState);

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
      ];

      if (
        history.length === 1 &&
        history.at(0)._deleted === false &&
        history.at(0).end_date === null
      ) {
        return false;
      }

      const inactive = history.some((data) => {
        if (data._deleted) return false;
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

  const getPublishersReactivatedYears = (year: string) => {
    const lastYearInactives = getPublishersInactiveYears(String(+year - 1));

    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    // find if publisher has at least one report this service year

    const result = lastYearInactives.filter((person) => {
      const hasReport = reports.some((report) => {
        if (report.report_data._deleted) return false;
        if (report.report_data.person_uid !== person.person_uid) return false;
        if (!report.report_data.shared_ministry) return false;

        const reportDate = report.report_data.report_date;

        return reportDate >= startMonth && reportDate <= endMonth;
      });

      return hasReport;
    });

    return result;
  };

  const getPublishersActiveForBranch = (month: string) => {
    const personActive: PersonType[] = [];

    const active = getPublishersActive(month);

    for (const person of active) {
      const isInactive = personCheckInactivityState(person, month);

      if (!isInactive) {
        personActive.push(person);
      }
    }

    return personActive;
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
    getPublishersReactivatedYears,
    getPublishersActiveForBranch,
  };
};

export default usePersons;
