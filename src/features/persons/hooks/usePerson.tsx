import { useRecoilValue } from 'recoil';
import { EnrollmentType, PersonType, PrivilegeType } from '@definition/person';
import { formatDate } from '@services/dateformat';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { addMonths } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { BadgeColor } from '@definition/app';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';

const usePerson = () => {
  const { t } = useAppTranslation();

  const reports = useRecoilValue(congFieldServiceReportsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const getName = (person: PersonType) => {
    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  };

  const personIsMidweekStudent = (person: PersonType) => {
    return person.person_data.midweek_meeting_student.active.value;
  };

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

  const personIsPrivilegeActive = (
    person: PersonType,
    privilege: PrivilegeType,
    month?: string
  ) => {
    if (!month) {
      const isActive = person.person_data.privileges.some(
        (record) =>
          record.privilege.value === privilege &&
          record.end_date.value === null &&
          record._deleted.value === false
      );

      return isActive;
    }

    const history = person.person_data.privileges.filter(
      (record) =>
        record._deleted.value === false &&
        record.privilege.value === privilege &&
        record.start_date.value?.length > 0
    );

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date.value);
      const endDate = record.end_date.value
        ? new Date(record.end_date.value)
        : new Date();

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    });

    return isActive;
  };

  const personIsEnrollmentActive = (
    person: PersonType,
    enrollment: EnrollmentType,
    month?: string
  ) => {
    if (!month) {
      const isActive = person.person_data.enrollments.some(
        (record) =>
          record.enrollment.value === enrollment &&
          record.end_date.value === null &&
          record._deleted.value === false
      );

      return isActive;
    }

    const history = person.person_data.enrollments.filter(
      (record) =>
        record._deleted.value === false &&
        record.enrollment.value === enrollment &&
        record.start_date.value?.length > 0
    );

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date.value);
      const endDate = record.end_date.value
        ? new Date(record.end_date.value)
        : new Date();

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    });

    return isActive;
  };

  const personIsInactivePublisher = (person: PersonType, month?: string) => {
    // default month to current month if undefined
    if (!month) {
      month = formatDate(new Date(), 'yyyy/MM');
    }

    // get first month of report
    let firstReport = person.person_data.first_month_report.value;
    firstReport = firstReport
      ? formatDate(new Date(firstReport), 'yyyy/MM')
      : undefined;

    let isInactive = true;
    let countReport = 0;

    do {
      // exit and count reports if it reaches first month report
      if (month === firstReport) {
        isInactive = countReport === 5;
        break;
      }

      // find report and check shared_ministry
      const report = reports.find(
        (record) =>
          record.report_data.person_uid === person.person_uid &&
          record.report_date === month
      );

      if (report?.report_data.shared_ministry) {
        isInactive = false;
        break;
      }

      // decrease month
      const date = addMonths(`${month}/01`, -1);
      month = formatDate(date, 'yyyy/MM');

      countReport++;
    } while (countReport <= 5);

    return isInactive;
  };

  const getBadges = (person: PersonType, month?: string) => {
    const badges: { name: string; color: BadgeColor }[] = [];

    const isElder = personIsPrivilegeActive(person, 'elder', month);
    const isMS = personIsPrivilegeActive(person, 'ms', month);
    const isAP = personIsEnrollmentActive(person, 'AP', month);
    const isFMF = personIsEnrollmentActive(person, 'FMF', month);
    const isFR = personIsEnrollmentActive(person, 'FR', month);
    const isFS = personIsEnrollmentActive(person, 'FS', month);

    const isBaptized = personIsBaptizedPublisher(person, month);
    const isUnbaptized = personIsUnbaptizedPublisher(person, month);
    const isMidweek = person.person_data.midweek_meeting_student.active.value;
    const isDisqualified = person.person_data.disqualified.value;
    const isInactivePublisher = personIsInactivePublisher(person, month);

    if (isDisqualified) {
      badges.push({ name: t('tr_disqualified'), color: 'red' });
    }

    if (isInactivePublisher) {
      badges.push({ name: t('tr_inactivePublisher'), color: 'red' });
    }

    if (!isDisqualified && !isInactivePublisher) {
      if (isElder) {
        badges.push({ name: t('tr_elder'), color: 'green' });
      }

      if (isMS) {
        badges.push({ name: t('tr_ministerialServant'), color: 'green' });
      }

      if (isAP) {
        badges.push({ name: t('tr_AP'), color: 'orange' });
      }

      if (isFMF) {
        badges.push({ name: t('tr_FMF'), color: 'orange' });
      }

      if (isFR) {
        badges.push({ name: t('tr_FR'), color: 'orange' });
      }

      if (isFS) {
        badges.push({ name: t('tr_FS'), color: 'orange' });
      }
    }

    const hasSpecialBadge =
      isDisqualified ||
      isInactivePublisher ||
      isElder ||
      isMS ||
      isAP ||
      isFMF ||
      isFR ||
      isFS;

    if (!hasSpecialBadge || isDisqualified) {
      if (isBaptized) {
        badges.push({ name: t('tr_baptizedPublisher'), color: 'grey' });
      }

      if (isUnbaptized) {
        badges.push({ name: t('tr_unbaptizedPublisher'), color: 'grey' });
      }

      if (isMidweek) {
        badges.push({ name: t('tr_midweekStudent'), color: 'grey' });
      }
    }

    return badges.sort((a, b) => a.name.localeCompare(b.name));
  };

  return {
    personIsPublisher,
    personIsActivePublisher,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
    personIsEnrollmentActive,
    personIsMidweekStudent,
    personIsInactivePublisher,
    getBadges,
    getName,
  };
};

export default usePerson;
