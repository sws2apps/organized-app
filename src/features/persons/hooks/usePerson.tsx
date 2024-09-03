import { useRecoilValue } from 'recoil';
import { PersonType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { addMonths } from '@utils/date';

const usePerson = () => {
  const reports = useRecoilValue(congFieldServiceReportsState);

  const personIsBaptizedPublisher = (person: PersonType, month?: string) => {
    if (!month) {
      return person.person_data.publisher_baptized.active.value;
    }

    const history = person.person_data.publisher_baptized.history.filter(
      (record) =>
        record._deleted.value === false && record.start_date.value?.length > 0
    );

    const isValid = history.some((record) => {
      const startDate = new Date(record.start_date.value);
      const endDate = record.end_date.value
        ? new Date(record.end_date.value)
        : new Date();

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    });

    return isValid;
  };

  const personIsUnbaptizedPublisher = (person: PersonType, month?: string) => {
    if (!month) {
      return person.person_data.publisher_unbaptized.active.value;
    }

    const history = person.person_data.publisher_unbaptized.history.filter(
      (record) =>
        record._deleted.value === false && record.start_date.value?.length > 0
    );

    const isValid = history.some((record) => {
      const startDate = new Date(record.start_date.value);
      const endDate = record.end_date.value
        ? new Date(record.end_date.value)
        : new Date();

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    });

    return isValid;
  };

  const personIsPublisher = (person: PersonType, month?: string) => {
    const isBaptized = personIsBaptizedPublisher(person, month);
    const isUnbaptized = personIsUnbaptizedPublisher(person, month);

    return isBaptized || isUnbaptized;
  };

  const personIsActivePublisher = (person: PersonType, month?: string) => {
    // default month to current month if undefined
    if (!month) {
      month = formatDate(new Date(), 'yyyy/MM');
    }

    // get first month of report
    let firstReport = person.person_data.first_month_report.value;
    firstReport = firstReport
      ? formatDate(new Date(firstReport), 'yyyy/MM')
      : undefined;

    let isActive = false;
    let countReport = 0;

    do {
      // exit and count reports if it reaches first month report
      if (month === firstReport) {
        isActive = countReport < 5;
        break;
      }

      // find report and check shared_ministry
      const report = reports.find(
        (record) =>
          record.report_data.person_uid === person.person_uid &&
          record.report_date === month
      );

      if (report?.report_data.shared_ministry) {
        isActive = true;
        break;
      }

      // decrease month
      const date = addMonths(`${month}/01`, -1);
      month = formatDate(date, 'yyyy/MM');

      countReport++;
    } while (countReport <= 5);

    return isActive;
  };

  return {
    personIsPublisher,
    personIsActivePublisher,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
  };
};

export default usePerson;
