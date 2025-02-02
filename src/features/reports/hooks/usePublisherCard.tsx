import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { S21CardData, S21CardMonthData } from '@definition/report';
import { createArrayFromMonths, currentServiceYear } from '@utils/date';
import { personsState } from '@states/persons';
import { PersonType } from '@definition/person';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import {
  fullnameOptionState,
  JWLangLocaleState,
  JWLangState,
  shortDateFormatState,
} from '@states/settings';
import { formatDate } from '@services/dateformat';
import { buildPersonFullname } from '@utils/common';
import { generateMonthNames } from '@services/i18n/translation';
import usePerson from '@features/persons/hooks/usePerson';

const usePublisherCard = () => {
  const { t } = useAppTranslation();

  const {
    personIsPrivilegeYearActive,
    personIsEnrollmentYearActive,
    personIsEnrollmentActive,
  } = usePerson();

  const lang = useRecoilValue(JWLangState);
  const persons = useRecoilValue(personsState);
  const reports = useRecoilValue(congFieldServiceReportsState);
  const dateFormat = useRecoilValue(shortDateFormatState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const sourceLocale = useRecoilValue(JWLangLocaleState);

  const years = useMemo(() => {
    const result: string[] = [];
    const year = currentServiceYear();
    const prevYear = String(+year - 1).toString();

    result.push(prevYear, year);

    return result;
  }, []);

  const getPerson = (person_uid) => {
    return persons.find((record) => record.person_uid === person_uid);
  };

  const getPersonData = (
    card: S21CardData,
    person: PersonType,
    year: string
  ) => {
    card.gender = {
      male: person.person_data.male.value,
      female: person.person_data.female.value,
    };

    const birthDate = person.person_data.birth_date.value;
    if (birthDate?.length > 0) {
      card.birth_date = formatDate(new Date(birthDate), dateFormat);
    }

    const baptismDate =
      person.person_data.publisher_baptized.baptism_date.value;
    if (baptismDate?.length > 0) {
      card.baptism_date = formatDate(new Date(baptismDate), dateFormat);
    }

    const isAnointed = person.person_data.publisher_baptized.anointed.value;
    card.hope = { anointed: isAnointed, other_sheep: !isAnointed };

    card.name = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );

    const isElder = personIsPrivilegeYearActive(person, 'elder', year);
    const isMS = personIsPrivilegeYearActive(person, 'ms', year);
    card.privileges = { elder: isElder, ms: isElder ? false : isMS };

    const isFMF = personIsEnrollmentYearActive(person, 'FMF', year);
    const isFS = personIsEnrollmentYearActive(person, 'FS', year);
    const isSFTS = isFMF || isFS;
    const isFR = personIsEnrollmentYearActive(person, 'FR', year);
    card.enrollments = { FMF: isFMF, FS: isFS, FR: isSFTS ? false : isFR };
  };

  const getReportData = (
    card: S21CardData,
    person: PersonType,
    year: string
  ) => {
    const startMonth = `${+year - 1}/09`;
    const endMonth = `${+year}/08`;

    card.months = [];

    const months = createArrayFromMonths(startMonth, endMonth);
    const monthNames = generateMonthNames(sourceLocale);

    for (const month of months) {
      const obj: S21CardMonthData = {
        AP: false,
        bible_studies: '',
        hours: '',
        month_name: monthNames[+month.split('/')[1] - 1],
        remarks: '',
        shared: false,
      };

      const report = reports.find(
        (record) =>
          record.report_data.report_date === month &&
          record.report_data.person_uid === person.person_uid
      );

      if (report) {
        obj.AP = personIsEnrollmentActive(person, 'AP', month);
        obj.bible_studies = report.report_data.bible_studies.toString();
        obj.hours = report.report_data.hours.field_service.toString();
        obj.shared = report.report_data.shared_ministry;

        let comments = report.report_data.comments;

        const approvedAssignments = report.report_data.hours.credit.value;
        const credits = report.report_data.hours.credit.approved;

        if (approvedAssignments > 0) {
          if (comments.length > 0) comments += '; ';
          comments += `${t('tr_approvedAssignments')}: ${approvedAssignments}`;
        }

        if (credits > 0) {
          if (comments.length > 0) comments += '; ';
          comments += `${t('tr_credit')}: ${credits}`;
        }

        obj.remarks = comments;
      }

      card.months.push(obj);
    }

    const total_hours = card.months.reduce(
      (acc, current) => acc + +current.hours,
      0
    );

    card.hours_total = total_hours.toString();
  };

  const getCardsData = (person_uid: string) => {
    const result: S21CardData[] = [];

    const person = getPerson(person_uid);

    for (const year of years) {
      const obj = {} as S21CardData;
      obj.year = year;
      obj.lang = lang;
      getPersonData(obj, person, year);
      getReportData(obj, person, year);

      result.push(obj);
    }

    return result as [S21CardData, S21CardData];
  };

  return { getCardsData };
};

export default usePublisherCard;
