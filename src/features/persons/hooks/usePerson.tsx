import { useAtomValue } from 'jotai';
import { EnrollmentType, PersonType, PrivilegeType } from '@definition/person';
import { useAppTranslation } from '@hooks/index';
import { BadgeColor } from '@definition/app';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { formatDate } from '@utils/date';

const usePerson = () => {
  const { t } = useAppTranslation();

  const fullnameOption = useAtomValue(fullnameOptionState);

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
    // default month to current month if undefined
    if (!month) {
      month = formatDate(new Date(), 'yyyy/MM');
    }

    const isValid = person.person_data.publisher_baptized?.history.some(
      (record) => {
        if (record._deleted) return false;
        if (!record.start_date) return false;

        const startDate = new Date(record.start_date);
        const endDate = record.end_date
          ? new Date(record.end_date)
          : new Date(`${month}/01`);

        const startMonth = formatDate(startDate, 'yyyy/MM');
        const endMonth = formatDate(endDate, 'yyyy/MM');

        return month >= startMonth && month <= endMonth;
      }
    );

    return isValid ?? false;
  };

  const personIsUnbaptizedPublisher = (person: PersonType, month?: string) => {
    // default month to current month if undefined
    if (!month) {
      month = formatDate(new Date(), 'yyyy/MM');
    }

    const isValid = person.person_data.publisher_unbaptized?.history.some(
      (record) => {
        if (record._deleted) return false;
        if (!record.start_date) return false;

        const startDate = new Date(record.start_date);
        const endDate = record.end_date
          ? new Date(record.end_date)
          : new Date(`${month}/01`);

        const startMonth = formatDate(startDate, 'yyyy/MM');
        const endMonth = formatDate(endDate, 'yyyy/MM');

        return month >= startMonth && month <= endMonth;
      }
    );

    return isValid ?? false;
  };

  const personIsPublisher = (person: PersonType, month?: string) => {
    // default month to current month if undefined
    if (!month) {
      month = formatDate(new Date(), 'yyyy/MM');
    }

    const isBaptized = personIsBaptizedPublisher(person, month);
    const isUnbaptized = personIsUnbaptizedPublisher(person, month);

    return isBaptized || isUnbaptized;
  };

  const personIsPrivilegeActive = (
    person: PersonType,
    privilege: PrivilegeType,
    month?: string
  ) => {
    if (!month) {
      const isActive = person.person_data.privileges.some(
        (record) =>
          record.privilege === privilege &&
          record.end_date === null &&
          record._deleted === false
      );

      return isActive;
    }

    const history = person.person_data.privileges.filter(
      (record) =>
        record._deleted === false &&
        record.privilege === privilege &&
        record.start_date?.length > 0
    );

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date);
      const endDate = record.end_date
        ? new Date(record.end_date)
        : new Date(`${month}/01`);

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
      const isActive = person.person_data.enrollments?.some(
        (record) =>
          record.enrollment === enrollment &&
          record.end_date === null &&
          record._deleted === false
      );

      return isActive ?? false;
    }

    const history =
      person.person_data.enrollments?.filter(
        (record) =>
          record._deleted === false &&
          record.enrollment === enrollment &&
          record.start_date?.length > 0
      ) ?? [];

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date);
      const endDate = record.end_date
        ? new Date(record.end_date)
        : new Date(`${month}/01`);

      const startMonth = formatDate(startDate, 'yyyy/MM');
      const endMonth = formatDate(endDate, 'yyyy/MM');

      return month >= startMonth && month <= endMonth;
    });

    return isActive;
  };

  const personGetFirstReport = (person: PersonType) => {
    // get all status history
    let history = [
      ...person.person_data.publisher_unbaptized.history,
      ...person.person_data.publisher_baptized.history,
    ];

    history = history.filter(
      (record) => !record._deleted && record.start_date?.length > 0
    );

    history.sort((a, b) => a.start_date.localeCompare(b.start_date));

    if (history.length === 0) return;

    const firstDate = new Date(history.at(0).start_date);

    return formatDate(firstDate, 'yyyy/MM');
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
    const isInactivePublisher = !isMidweek && !isBaptized && !isUnbaptized;

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

  const personIsEnrollmentYearActive = (
    person: PersonType,
    enrollment: EnrollmentType,
    year: string
  ) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const history = person.person_data.enrollments.filter(
      (record) =>
        record._deleted === false &&
        record.enrollment === enrollment &&
        record.start_date?.length > 0
    );

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date);
      const recordStart = formatDate(startDate, 'yyyy/MM');

      if (recordStart <= startMonth && record.end_date === null) return true;

      return recordStart >= startMonth && recordStart <= endMonth;
    });

    return isActive;
  };

  const personIsPrivilegeYearActive = (
    person: PersonType,
    privilege: PrivilegeType,
    year: string
  ) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const history = person.person_data.privileges.filter(
      (record) =>
        record._deleted === false &&
        record.privilege === privilege &&
        record.start_date?.length > 0
    );

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date);
      const recordStart = formatDate(startDate, 'yyyy/MM');

      if (recordStart <= startMonth && record.end_date === null) return true;

      return recordStart >= startMonth && recordStart <= endMonth;
    });

    return isActive;
  };

  const personIsPublisherYear = (person: PersonType, year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${year}/08`;

    const history = [
      ...person.person_data.publisher_baptized.history,
      ...person.person_data.publisher_unbaptized.history,
    ].filter((record) => !record._deleted && record.start_date?.length > 0);

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date);
      const recordStart = formatDate(startDate, 'yyyy/MM');

      if (recordStart <= startMonth && record.end_date === null) return true;

      return recordStart >= startMonth && recordStart <= endMonth;
    });

    return isActive;
  };

  const personIsAPContinuousYearActive = (person: PersonType, year: string) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${+year}/08`;

    const history = person.person_data.enrollments.filter(
      (record) =>
        record._deleted === false &&
        record.enrollment === 'AP' &&
        record.start_date?.length > 0
    );

    const isActive = history.some((record) => {
      const startDate = new Date(record.start_date);
      const recordStart = formatDate(startDate, 'yyyy/MM');

      if (recordStart <= startMonth && record.end_date === null) return true;

      const endDate = new Date(record.end_date);
      const recordEnd = formatDate(endDate, 'yyyy/MM');

      return (
        recordStart >= startMonth &&
        recordStart <= endMonth &&
        recordEnd !== recordStart
      );
    });

    return isActive;
  };

  const personIsElder = (person: PersonType) => {
    const isActive = person.person_data.privileges.some(
      (record) =>
        record._deleted === false &&
        record.end_date === null &&
        record.privilege === 'elder'
    );

    return isActive;
  };

  const personIsMS = (person: PersonType) => {
    const isActive = person.person_data.privileges.some(
      (record) =>
        record._deleted === false &&
        record.end_date === null &&
        record.privilege === 'ms'
    );

    return isActive;
  };

  return {
    personIsPublisher,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
    personIsPrivilegeActive,
    personIsEnrollmentActive,
    personIsMidweekStudent,
    getBadges,
    getName,
    personGetFirstReport,
    personIsEnrollmentYearActive,
    personIsPublisherYear,
    personIsPrivilegeYearActive,
    personIsAPContinuousYearActive,
    personIsElder,
    personIsMS,
  };
};

export default usePerson;
